import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { CreateMapDto, UpdateMapDto } from './dto';

@Injectable()
export class MapsService {
    constructor(private readonly db: DatabaseService) { }

    async create(novelId: string, dto: CreateMapDto) {
        const id = uuidv4();
        await this.db.execute(
            `INSERT INTO MAPS (id, novel_id, image_url, metadata)
             VALUES (:id, :novel_id, :image_url, :metadata)`,
            {
                id,
                novel_id: novelId,
                image_url: dto.image_url || null,
                metadata: dto.metadata ? JSON.stringify(dto.metadata) : null,
            },
        );
        return this.findOne(id);
    }

    async findAllByNovel(novelId: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, image_url, metadata FROM MAPS WHERE novel_id = :novel_id`,
            { novel_id: novelId },
        );
        return (result.rows as any[]).map(this.mapRow);
    }

    async findOne(id: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, image_url, metadata FROM MAPS WHERE id = :id`,
            { id },
        );
        const row = (result.rows as any[])?.[0];
        if (!row) throw new NotFoundException('Map not found');
        return this.mapRow(row);
    }

    async update(id: string, dto: UpdateMapDto) {
        const setClauses: string[] = [];
        const binds: any = { id };

        if (dto.image_url !== undefined) { setClauses.push('image_url = :image_url'); binds.image_url = dto.image_url; }
        if (dto.metadata !== undefined) { setClauses.push('metadata = :metadata'); binds.metadata = JSON.stringify(dto.metadata); }

        if (setClauses.length === 0) return this.findOne(id);
        await this.db.execute(`UPDATE MAPS SET ${setClauses.join(', ')} WHERE id = :id`, binds);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.db.execute(`DELETE FROM MAPS WHERE id = :id`, { id });
        return { deleted: true };
    }

    private mapRow(row: any) {
        return {
            id: row.ID,
            novel_id: row.NOVEL_ID,
            image_url: row.IMAGE_URL,
            metadata: row.METADATA ? JSON.parse(row.METADATA) : null,
        };
    }
}
