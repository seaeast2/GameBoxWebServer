import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { CreateCharacterDto, UpdateCharacterDto } from './dto';

@Injectable()
export class CharactersService {
    constructor(private readonly db: DatabaseService) { }

    async create(novelId: string, dto: CreateCharacterDto) {
        const id = uuidv4();
        await this.db.execute(
            `INSERT INTO CHARACTERS (id, novel_id, name, char_level, stats, items)
             VALUES (:id, :novel_id, :name, :char_level, :stats, :items)`,
            {
                id,
                novel_id: novelId,
                name: dto.name,
                char_level: dto.level || 1,
                stats: dto.stats ? JSON.stringify(dto.stats) : null,
                items: dto.items ? JSON.stringify(dto.items) : null,
            },
        );
        return this.findOne(id);
    }

    async findAllByNovel(novelId: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, name, char_level, stats, items FROM CHARACTERS WHERE novel_id = :novel_id ORDER BY name`,
            { novel_id: novelId },
        );
        return (result.rows as any[]).map(this.mapRow);
    }

    async findOne(id: string) {
        const result = await this.db.execute(
            `SELECT id, novel_id, name, char_level, stats, items FROM CHARACTERS WHERE id = :id`,
            { id },
        );
        const row = (result.rows as any[])?.[0];
        if (!row) {
            throw new NotFoundException('Character not found');
        }
        return this.mapRow(row);
    }

    async update(id: string, dto: UpdateCharacterDto) {
        const setClauses: string[] = [];
        const binds: any = { id };

        if (dto.name !== undefined) {
            setClauses.push('name = :name');
            binds.name = dto.name;
        }
        if (dto.level !== undefined) {
            setClauses.push('char_level = :char_level');
            binds.char_level = dto.level;
        }
        if (dto.stats !== undefined) {
            setClauses.push('stats = :stats');
            binds.stats = JSON.stringify(dto.stats);
        }
        if (dto.items !== undefined) {
            setClauses.push('items = :items');
            binds.items = JSON.stringify(dto.items);
        }

        if (setClauses.length === 0) {
            return this.findOne(id);
        }

        await this.db.execute(
            `UPDATE CHARACTERS SET ${setClauses.join(', ')} WHERE id = :id`,
            binds,
        );
        return this.findOne(id);
    }

    async remove(id: string) {
        const char = await this.findOne(id);
        await this.db.execute(`DELETE FROM CHARACTERS WHERE id = :id`, { id });
        return { deleted: true };
    }

    private mapRow(row: any) {
        return {
            id: row.ID,
            novel_id: row.NOVEL_ID,
            name: row.NAME,
            level: row.CHAR_LEVEL,
            stats: row.STATS ? JSON.parse(row.STATS) : null,
            items: row.ITEMS ? JSON.parse(row.ITEMS) : null,
        };
    }
}
