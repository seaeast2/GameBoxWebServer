import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { CreateNovelDto, UpdateNovelDto } from './dto';

@Injectable()
export class NovelsService {
    constructor(private readonly db: DatabaseService) { }

    async create(userId: string, dto: CreateNovelDto) {
        const id = uuidv4();
        await this.db.execute(
            `INSERT INTO NOVELS (id, user_id, title, genre, description, is_collab, created_at)
             VALUES (:id, :user_id, :title, :genre, :description, 'N', CURRENT_TIMESTAMP)`,
            {
                id,
                user_id: userId,
                title: dto.title,
                genre: dto.genre || null,
                description: dto.description || null,
            },
        );
        return this.findOne(id, userId);
    }

    async findAll(userId: string) {
        const result = await this.db.execute(
            `SELECT id, user_id, title, genre, description, is_collab, created_at
             FROM NOVELS
             WHERE user_id = :user_id
             ORDER BY created_at DESC`,
            { user_id: userId },
        );
        return (result.rows as any[]).map(this.mapRow);
    }

    async findOne(id: string, userId?: string) {
        const result = await this.db.execute(
            `SELECT id, user_id, title, genre, description, is_collab, created_at
             FROM NOVELS WHERE id = :id`,
            { id },
        );
        const novel = (result.rows as any[])?.[0];
        if (!novel) {
            throw new NotFoundException('Novel not found');
        }
        return this.mapRow(novel);
    }

    async update(id: string, userId: string, dto: UpdateNovelDto) {
        await this.checkOwnership(id, userId);
        const setClauses: string[] = [];
        const binds: any = { id };

        if (dto.title !== undefined) {
            setClauses.push('title = :title');
            binds.title = dto.title;
        }
        if (dto.genre !== undefined) {
            setClauses.push('genre = :genre');
            binds.genre = dto.genre;
        }
        if (dto.description !== undefined) {
            setClauses.push('description = :description');
            binds.description = dto.description;
        }
        if (dto.is_collab !== undefined) {
            setClauses.push('is_collab = :is_collab');
            binds.is_collab = dto.is_collab;
        }

        if (setClauses.length === 0) {
            return this.findOne(id, userId);
        }

        await this.db.execute(
            `UPDATE NOVELS SET ${setClauses.join(', ')} WHERE id = :id`,
            binds,
        );
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string) {
        await this.checkOwnership(id, userId);
        await this.db.execute(`DELETE FROM NOVELS WHERE id = :id`, { id });
        return { deleted: true };
    }

    private async checkOwnership(novelId: string, userId: string) {
        const result = await this.db.execute(
            `SELECT user_id FROM NOVELS WHERE id = :id`,
            { id: novelId },
        );
        const novel = (result.rows as any[])?.[0];
        if (!novel) {
            throw new NotFoundException('Novel not found');
        }
        if (novel.USER_ID !== userId) {
            // Check if user is a collaborator
            const collab = await this.db.execute(
                `SELECT id FROM COLLABORATIONS WHERE novel_id = :novel_id AND user_id = :user_id AND role = 'editor'`,
                { novel_id: novelId, user_id: userId },
            );
            if (!(collab.rows as any[])?.length) {
                throw new ForbiddenException('You do not have access to this novel');
            }
        }
    }

    private mapRow(row: any) {
        return {
            id: row.ID,
            user_id: row.USER_ID,
            title: row.TITLE,
            genre: row.GENRE,
            description: row.DESCRIPTION,
            is_collab: row.IS_COLLAB,
            created_at: row.CREATED_AT,
        };
    }
}
