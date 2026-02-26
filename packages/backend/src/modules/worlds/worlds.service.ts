import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { CreateWorldDto, UpdateWorldDto } from './dto';

@Injectable()
export class WorldsService {
    constructor(private readonly db: DatabaseService) { }

    async create(novelId: string, dto: CreateWorldDto) {
        const id = uuidv4();
        await this.db.execute(
            `INSERT INTO WORLDS (id, novel_id, name, description, metadata)
             VALUES (:id, :novel_id, :name, :description, :metadata)`,
            {
                id,
                novel_id: novelId,
                name: dto.name,
                description: dto.description || null,
                metadata: dto.metadata ? JSON.stringify(dto.metadata) : null,
            },
        );
        return this.findOne(id);
    }

    async findAllByNovel(novelId: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, name, description, metadata FROM WORLDS WHERE novel_id = :novel_id ORDER BY name`,
            { novel_id: novelId },
        );
        return (result.rows as any[]).map(this.mapRow);
    }

    async findOne(id: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, name, description, metadata FROM WORLDS WHERE id = :id`,
            { id },
        );
        const row = (result.rows as any[])?.[0];
        if (!row) throw new NotFoundException('World not found');
        return this.mapRow(row);
    }

    async update(id: string, dto: UpdateWorldDto) {
        const setClauses: string[] = [];
        const binds: any = { id };

        if (dto.name !== undefined) { setClauses.push('name = :name'); binds.name = dto.name; }
        if (dto.description !== undefined) { setClauses.push('description = :description'); binds.description = dto.description; }
        if (dto.metadata !== undefined) { setClauses.push('metadata = :metadata'); binds.metadata = JSON.stringify(dto.metadata); }

        if (setClauses.length === 0) return this.findOne(id);

        await this.db.execute(`UPDATE WORLDS SET ${setClauses.join(', ')} WHERE id = :id`, binds);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.db.execute(`DELETE FROM WORLDS WHERE id = :id`, { id });
        return { deleted: true };
    }

    private mapRow(row: any) {
        return {
            id: row.ID,
            novel_id: row.NOVEL_ID,
            name: row.NAME,
            description: row.DESCRIPTION,
            metadata: row.METADATA ? JSON.parse(row.METADATA) : null,
        };
    }
}
