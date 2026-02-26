import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { CreateForeshadowDto, UpdateForeshadowDto } from './dto';

@Injectable()
export class ForeshadowsService {
    constructor(private readonly db: DatabaseService) { }

    async create(timelineId: string, dto: CreateForeshadowDto) {
        const id = uuidv4();
        await this.db.execute(
            `INSERT INTO FORESHADOWS (id, timeline_id, description, resolved)
             VALUES (:id, :timeline_id, :description, 'N')`,
            {
                id,
                timeline_id: timelineId,
                description: dto.description,
            },
        );
        return this.findOne(id);
    }

    async findAllByTimeline(timelineId: string) {
        const result = await this.db.execute(
            `SELECT id, timeline_id, description, resolved FROM FORESHADOWS WHERE timeline_id = :timeline_id`,
            { timeline_id: timelineId },
        );
        return (result.rows as any[]).map(this.mapRow);
    }

    async findOne(id: string) {
        const result = await this.db.execute(
            `SELECT id, timeline_id, description, resolved FROM FORESHADOWS WHERE id = :id`,
            { id },
        );
        const row = (result.rows as any[])?.[0];
        if (!row) throw new NotFoundException('Foreshadow not found');
        return this.mapRow(row);
    }

    async update(id: string, dto: UpdateForeshadowDto) {
        const setClauses: string[] = [];
        const binds: any = { id };

        if (dto.description !== undefined) { setClauses.push('description = :description'); binds.description = dto.description; }
        if (dto.resolved !== undefined) { setClauses.push('resolved = :resolved'); binds.resolved = dto.resolved; }

        if (setClauses.length === 0) return this.findOne(id);
        await this.db.execute(`UPDATE FORESHADOWS SET ${setClauses.join(', ')} WHERE id = :id`, binds);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.db.execute(`DELETE FROM FORESHADOWS WHERE id = :id`, { id });
        return { deleted: true };
    }

    private mapRow(row: any) {
        return {
            id: row.ID,
            timeline_id: row.TIMELINE_ID,
            description: row.DESCRIPTION,
            resolved: row.RESOLVED,
        };
    }
}
