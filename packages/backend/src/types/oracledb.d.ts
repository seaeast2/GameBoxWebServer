declare module 'oracledb' {
    export const OUT_FORMAT_OBJECT: number;

    export interface PoolAttributes {
        user?: string;
        password?: string;
        connectString?: string;
        configDir?: string;
        walletLocation?: string;
        walletPassword?: string;
        poolMin?: number;
        poolMax?: number;
        poolIncrement?: number;
    }

    export interface ExecuteOptions {
        outFormat?: number;
        autoCommit?: boolean;
        [key: string]: any;
    }

    export interface ExecuteManyOptions {
        autoCommit?: boolean;
        [key: string]: any;
    }

    export interface Result<T> {
        rows?: T[];
        rowsAffected?: number;
        metaData?: any[];
        [key: string]: any;
    }

    export interface Results<T> {
        rowsAffected?: number;
        [key: string]: any;
    }

    export type BindParameters = Record<string, any> | any[];

    export interface Connection {
        execute(sql: string, binds?: BindParameters, options?: ExecuteOptions): Promise<Result<any>>;
        executeMany(sql: string, binds: BindParameters[], options?: ExecuteManyOptions): Promise<Results<any>>;
        close(): Promise<void>;
    }

    export interface Pool {
        getConnection(): Promise<Connection>;
        close(drainTime?: number): Promise<void>;
    }

    export function createPool(attrs: PoolAttributes): Promise<Pool>;
    export function getConnection(attrs: PoolAttributes): Promise<Connection>;
    export function initOracleClient(attrs?: any): void;
}
