import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';

@Injectable()
export class VersionsService {
    constructor(private readonly db: DatabaseService) { }

    async findAllByNovel(novelId: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, timeline_id, content, created_at
             FROM VERSIONS WHERE novel_id = :novel_id
             ORDER BY created_at DESC`,
            { novel_id: novelId },
        );
        return (result.rows as any[]).map(this.mapRow);
    }

    async findOne(id: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, timeline_id, content, created_at
             FROM VERSIONS WHERE id = :id`,
            { id },
        );
        const row = (result.rows as any[])?.[0];
        if (!row) throw new NotFoundException('Version not found');
        return this.mapRow(row);
    }

    async restore(versionId: string) {
        const version = await this.findOne(versionId);
        if (!version.timeline_id) {
            throw new NotFoundException('No timeline associated with this version');
        }

        // Update timeline with version content
        await this.db.execute(
            `UPDATE TIMELINES SET summary = :content WHERE id = :timeline_id`,
            { content: version.content, timeline_id: version.timeline_id },
        );

        return { restored: true, version_id: versionId };
    }

    /**
     * Create a version snapshot (called internally when content changes)
     */
    async createSnapshot(novelId: string, timelineId: string | null, content: string) {
        const id = uuidv4();
        await this.db.execute(
            `INSERT INTO VERSIONS (id, novel_id, timeline_id, content, created_at)
             VALUES (:id, :novel_id, :timeline_id, :content, CURRENT_TIMESTAMP)`,
            {
                id,
                novel_id: novelId,
                timeline_id: timelineId,
                content,
            },
        );
        return this.findOne(id);
    }

    private mapRow(row: any) {
        return {
            id: row.ID,
            novel_id: row.NOVEL_ID,
            timeline_id: row.TIMELINE_ID,
            content: row.CONTENT,
            created_at: row.CREATED_AT,
        };
    }
}
