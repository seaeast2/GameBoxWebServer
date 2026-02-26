import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { VersionsService } from '../versions/versions.service';
import { SaveEpisodeTextDto, UpdateEpisodeTextDto } from './dto';

@Injectable()
export class EpisodesService {
    constructor(
        private readonly db: DatabaseService,
        private readonly versionsService: VersionsService,
    ) { }

    async saveText(novelId: string, episode: number, dto: SaveEpisodeTextDto) {
        // Check if episode text already exists
        const existing = await this.db.execute(
            `SELECT id FROM EPISODES WHERE novel_id = :novel_id AND episode = :episode`,
            { novel_id: novelId, episode },
        );

        let episodeId: string;
        if ((existing.rows as any[])?.length > 0) {
            episodeId = (existing.rows as any[])[0].ID;
            await this.db.execute(
                `UPDATE EPISODES SET content = :content, updated_at = CURRENT_TIMESTAMP
                 WHERE novel_id = :novel_id AND episode = :episode`,
                { content: dto.content, novel_id: novelId, episode },
            );
        } else {
            episodeId = uuidv4();
            await this.db.execute(
                `INSERT INTO EPISODES (id, novel_id, episode, content, updated_at)
                 VALUES (:id, :novel_id, :episode, :content, CURRENT_TIMESTAMP)`,
                { id: episodeId, novel_id: novelId, episode, content: dto.content },
            );
        }

        // Auto-create version snapshot
        await this.versionsService.createSnapshot(novelId, null, dto.content);

        return this.getText(novelId, episode);
    }

    async getText(novelId: string, episode: number) {
        const result = await this.db.execute(
            `SELECT id, novel_id, episode, content, updated_at FROM EPISODES
             WHERE novel_id = :novel_id AND episode = :episode`,
            { novel_id: novelId, episode },
        );
        const row = (result.rows as any[])?.[0];
        if (!row) {
            throw new NotFoundException(`Episode ${episode} text not found`);
        }
        return {
            episode_id: row.ID,
            novel_id: row.NOVEL_ID,
            episode: row.EPISODE,
            content: row.CONTENT,
            updated_at: row.UPDATED_AT,
        };
    }

    async updateText(novelId: string, episode: number, dto: UpdateEpisodeTextDto) {
        const existing = await this.db.execute(
            `SELECT id FROM EPISODES WHERE novel_id = :novel_id AND episode = :episode`,
            { novel_id: novelId, episode },
        );
        if (!(existing.rows as any[])?.length) {
            throw new NotFoundException(`Episode ${episode} text not found`);
        }

        await this.db.execute(
            `UPDATE EPISODES SET content = :content, updated_at = CURRENT_TIMESTAMP
             WHERE novel_id = :novel_id AND episode = :episode`,
            { content: dto.content, novel_id: novelId, episode },
        );

        // Auto-create version snapshot
        await this.versionsService.createSnapshot(novelId, null, dto.content);

        return this.getText(novelId, episode);
    }

    async getVersions(novelId: string, episode: number) {
        // Get episode versions from the versions table
        const result = await this.db.execute(
            `SELECT v.id, v.novel_id, v.timeline_id, v.content, v.created_at
             FROM VERSIONS v
             WHERE v.novel_id = :novel_id
             ORDER BY v.created_at DESC`,
            { novel_id: novelId },
        );
        return (result.rows as any[]).map(row => ({
            id: row.ID,
            novel_id: row.NOVEL_ID,
            timeline_id: row.TIMELINE_ID,
            content: row.CONTENT,
            created_at: row.CREATED_AT,
        }));
    }

    async restoreVersion(novelId: string, episode: number, versionId: string) {
        const version = await this.versionsService.findOne(versionId);

        await this.db.execute(
            `UPDATE EPISODES SET content = :content, updated_at = CURRENT_TIMESTAMP
             WHERE novel_id = :novel_id AND episode = :episode`,
            { content: version.content, novel_id: novelId, episode },
        );

        return this.getText(novelId, episode);
    }
}
