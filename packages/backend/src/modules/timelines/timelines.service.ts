import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { CreateTimelineDto, UpdateTimelineDto } from './dto';

@Injectable()
export class TimelinesService {
    constructor(private readonly db: DatabaseService) { }

    async create(novelId: string, dto: CreateTimelineDto) {
        const id = uuidv4();
        await this.db.execute(
            `INSERT INTO TIMELINES (id, novel_id, episode, summary, created_at)
             VALUES (:id, :novel_id, :episode, :summary, CURRENT_TIMESTAMP)`,
            {
                id,
                novel_id: novelId,
                episode: dto.episode,
                summary: dto.summary || null,
            },
        );
        return this.findOne(id);
    }

    async findAllByNovel(novelId: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, episode, summary, ai_content, created_at
             FROM TIMELINES WHERE novel_id = :novel_id ORDER BY episode`,
            { novel_id: novelId },
        );
        return (result.rows as any[]).map(this.mapRow);
    }

    async findOne(id: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, episode, summary, ai_content, created_at
             FROM TIMELINES WHERE id = :id`,
            { id },
        );
        const row = (result.rows as any[])?.[0];
        if (!row) throw new NotFoundException('Timeline not found');
        return this.mapRow(row);
    }

    async update(id: string, dto: UpdateTimelineDto) {
        const setClauses: string[] = [];
        const binds: any = { id };

        if (dto.episode !== undefined) { setClauses.push('episode = :episode'); binds.episode = dto.episode; }
        if (dto.summary !== undefined) { setClauses.push('summary = :summary'); binds.summary = dto.summary; }

        if (setClauses.length === 0) return this.findOne(id);
        await this.db.execute(`UPDATE TIMELINES SET ${setClauses.join(', ')} WHERE id = :id`, binds);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.db.execute(`DELETE FROM TIMELINES WHERE id = :id`, { id });
        return { deleted: true };
    }

    private mapRow(row: any) {
        return {
            id: row.ID,
            novel_id: row.NOVEL_ID,
            episode: row.EPISODE,
            summary: row.SUMMARY,
            ai_content: row.AI_CONTENT,
            created_at: row.CREATED_AT,
        };
    }
}
