import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const oracledb = require('oracledb');
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool!: oracledb.Pool;
    private readonly logger = new Logger(DatabaseService.name);

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        // Fetch CLOB columns as strings to avoid circular Lob stream objects
        oracledb.fetchAsString = [oracledb.CLOB];

        const walletDir = path.resolve(
            this.configService.get<string>('WALLET_DIR', './assets/wallet'),
        );

        if (!fs.existsSync(walletDir)) {
            const msg =
                `Wallet directory not found at ${walletDir}. ` +
                `Please run "npm run extract-wallet" or extract Wallet_WebNovelDB.zip to ${walletDir}`;
            this.logger.error(msg);
            throw new Error(msg);
        }

        if (!fs.existsSync(path.join(walletDir, 'ewallet.pem'))) {
            const msg = `ewallet.pem not found in ${walletDir}. Wallet may be incomplete.`;
            this.logger.error(msg);
            throw new Error(msg);
        }

        try {
            this.pool = await oracledb.createPool({
                user: this.configService.get<string>('DB_USER'),
                password: this.configService.get<string>('DB_PASSWORD'),
                connectString: this.configService.get<string>('DB_CONNECT_STRING'),
                configDir: walletDir,
                walletLocation: walletDir,
                walletPassword: this.configService.get<string>('WALLET_PASSWORD'),
                poolMin: 2,
                poolMax: 10,
                poolIncrement: 1,
            });
            this.logger.log('Oracle Database connection pool created successfully');
        } catch (err) {
            this.logger.error('Failed to create Oracle connection pool', err);
            throw err;
        }
    }

    async onModuleDestroy() {
        if (this.pool) {
            try {
                await this.pool.close(0);
                this.logger.log('Oracle Database connection pool closed');
            } catch (err) {
                this.logger.error('Error closing connection pool', err);
            }
        }
    }

    async execute(
        sql: string,
        binds: oracledb.BindParameters = {},
        options: oracledb.ExecuteOptions = {},
    ): Promise<oracledb.Result<any>> {
        let connection: oracledb.Connection | undefined;
        try {
            connection = await this.pool.getConnection();
            const result = await connection.execute(sql, binds, {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true,
                ...options,
            });
            return result;
        } catch (err) {
            this.logger.error(`SQL Error: ${sql}`, err);
            throw err;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    async executeMany(
        sql: string,
        binds: oracledb.BindParameters[],
        options: oracledb.ExecuteManyOptions = {},
    ): Promise<oracledb.Results<any>> {
        let connection: oracledb.Connection | undefined;
        try {
            connection = await this.pool.getConnection();
            const result = await connection.executeMany(sql, binds, {
                autoCommit: true,
                ...options,
            });
            return result;
        } catch (err) {
            this.logger.error(`SQL Error (executeMany): ${sql}`, err);
            throw err;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Initialize database tables if they don't exist
     */
    async initializeTables(): Promise<void> {
        const tables = [
            {
                name: 'USERS',
                sql: `CREATE TABLE USERS (
                    id VARCHAR2(36) PRIMARY KEY,
                    email VARCHAR2(255) UNIQUE NOT NULL,
                    password VARCHAR2(255) NOT NULL,
                    nickname VARCHAR2(100) NOT NULL,
                    role VARCHAR2(50) DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`,
            },
            {
                name: 'NOVELS',
                sql: `CREATE TABLE NOVELS (
                    id VARCHAR2(36) PRIMARY KEY,
                    user_id VARCHAR2(36) NOT NULL,
                    title VARCHAR2(255) NOT NULL,
                    genre VARCHAR2(100),
                    description CLOB,
                    is_collab CHAR(1) DEFAULT 'N',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT fk_novels_user FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
                )`,
            },
            {
                name: 'CHARACTERS',
                sql: `CREATE TABLE CHARACTERS (
                    id VARCHAR2(36) PRIMARY KEY,
                    novel_id VARCHAR2(36) NOT NULL,
                    name VARCHAR2(100) NOT NULL,
                    char_level NUMBER DEFAULT 1,
                    stats CLOB,
                    items CLOB,
                    CONSTRAINT fk_chars_novel FOREIGN KEY (novel_id) REFERENCES NOVELS(id) ON DELETE CASCADE
                )`,
            },
            {
                name: 'WORLDS',
                sql: `CREATE TABLE WORLDS (
                    id VARCHAR2(36) PRIMARY KEY,
                    novel_id VARCHAR2(36) NOT NULL,
                    name VARCHAR2(100) NOT NULL,
                    description CLOB,
                    metadata CLOB,
                    CONSTRAINT fk_worlds_novel FOREIGN KEY (novel_id) REFERENCES NOVELS(id) ON DELETE CASCADE
                )`,
            },
            {
                name: 'MAPS',
                sql: `CREATE TABLE MAPS (
                    id VARCHAR2(36) PRIMARY KEY,
                    novel_id VARCHAR2(36) NOT NULL,
                    image_url VARCHAR2(500),
                    metadata CLOB,
                    CONSTRAINT fk_maps_novel FOREIGN KEY (novel_id) REFERENCES NOVELS(id) ON DELETE CASCADE
                )`,
            },
            {
                name: 'TIMELINES',
                sql: `CREATE TABLE TIMELINES (
                    id VARCHAR2(36) PRIMARY KEY,
                    novel_id VARCHAR2(36) NOT NULL,
                    episode NUMBER NOT NULL,
                    summary CLOB,
                    ai_content CLOB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT fk_timelines_novel FOREIGN KEY (novel_id) REFERENCES NOVELS(id) ON DELETE CASCADE
                )`,
            },
            {
                name: 'FORESHADOWS',
                sql: `CREATE TABLE FORESHADOWS (
                    id VARCHAR2(36) PRIMARY KEY,
                    timeline_id VARCHAR2(36) NOT NULL,
                    description CLOB,
                    resolved CHAR(1) DEFAULT 'N',
                    CONSTRAINT fk_foreshadows_timeline FOREIGN KEY (timeline_id) REFERENCES TIMELINES(id) ON DELETE CASCADE
                )`,
            },
            {
                name: 'CHARACTER_TIMELINES',
                sql: `CREATE TABLE CHARACTER_TIMELINES (
                    id VARCHAR2(36) PRIMARY KEY,
                    character_id VARCHAR2(36) NOT NULL,
                    timeline_id VARCHAR2(36) NOT NULL,
                    char_level NUMBER DEFAULT 1,
                    stats CLOB,
                    items CLOB,
                    location VARCHAR2(255),
                    CONSTRAINT fk_ct_character FOREIGN KEY (character_id) REFERENCES CHARACTERS(id) ON DELETE CASCADE,
                    CONSTRAINT fk_ct_timeline FOREIGN KEY (timeline_id) REFERENCES TIMELINES(id) ON DELETE CASCADE
                )`,
            },
            {
                name: 'COLLABORATIONS',
                sql: `CREATE TABLE COLLABORATIONS (
                    id VARCHAR2(36) PRIMARY KEY,
                    novel_id VARCHAR2(36) NOT NULL,
                    user_id VARCHAR2(36) NOT NULL,
                    role VARCHAR2(50) DEFAULT 'viewer',
                    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT fk_collab_novel FOREIGN KEY (novel_id) REFERENCES NOVELS(id) ON DELETE CASCADE,
                    CONSTRAINT fk_collab_user FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
                )`,
            },
            {
                name: 'PAYMENTS',
                sql: `CREATE TABLE PAYMENTS (
                    id VARCHAR2(36) PRIMARY KEY,
                    user_id VARCHAR2(36) NOT NULL,
                    plan VARCHAR2(50) NOT NULL,
                    status VARCHAR2(50) DEFAULT 'active',
                    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expired_at TIMESTAMP,
                    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
                )`,
            },
            {
                name: 'VERSIONS',
                sql: `CREATE TABLE VERSIONS (
                    id VARCHAR2(36) PRIMARY KEY,
                    novel_id VARCHAR2(36) NOT NULL,
                    timeline_id VARCHAR2(36),
                    content CLOB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT fk_versions_novel FOREIGN KEY (novel_id) REFERENCES NOVELS(id) ON DELETE CASCADE,
                    CONSTRAINT fk_versions_timeline FOREIGN KEY (timeline_id) REFERENCES TIMELINES(id) ON DELETE SET NULL
                )`,
            },
            {
                name: 'EPISODES',
                sql: `CREATE TABLE EPISODES (
                    id VARCHAR2(36) PRIMARY KEY,
                    novel_id VARCHAR2(36) NOT NULL,
                    episode NUMBER NOT NULL,
                    content CLOB,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT fk_episodes_novel FOREIGN KEY (novel_id) REFERENCES NOVELS(id) ON DELETE CASCADE,
                    CONSTRAINT uq_episodes_novel_ep UNIQUE (novel_id, episode)
                )`,
            },
        ];

        for (const table of tables) {
            try {
                const exists = await this.execute(
                    `SELECT COUNT(*) AS cnt FROM user_tables WHERE table_name = :name`,
                    { name: table.name },
                );
                if (exists.rows && (exists.rows as any[])[0]?.CNT === 0) {
                    await this.execute(table.sql);
                    this.logger.log(`Table ${table.name} created`);
                } else {
                    this.logger.log(`Table ${table.name} already exists`);
                }
            } catch (err) {
                this.logger.error(`Error creating table ${table.name}`, err);
            }
        }
    }
}
