import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { CreateCollaborationDto, UpdateCollaborationDto } from './dto';

@Injectable()
export class CollaborationsService {
    constructor(private readonly db: DatabaseService) { }

    async create(novelId: string, dto: CreateCollaborationDto) {
        // Find user by email
        const userResult = await this.db.execute(
            `SELECT id FROM USERS WHERE email = :email`,
            { email: dto.user_email },
        );
        const user = (userResult.rows as any[])?.[0];
        if (!user) {
            throw new NotFoundException('User not found with given email');
        }

        // Check if already collaborator
        const existing = await this.db.execute(
            `SELECT id FROM COLLABORATIONS WHERE novel_id = :novel_id AND user_id = :user_id`,
            { novel_id: novelId, user_id: user.ID },
        );
        if ((existing.rows as any[])?.length > 0) {
            throw new ConflictException('User is already a collaborator');
        }

        const id = uuidv4();
        await this.db.execute(
            `INSERT INTO COLLABORATIONS (id, novel_id, user_id, role, joined_at)
             VALUES (:id, :novel_id, :user_id, :role, CURRENT_TIMESTAMP)`,
            {
                id,
                novel_id: novelId,
                user_id: user.ID,
                role: dto.role || 'viewer',
            },
        );

        return this.findOne(id);
    }

    async findAllByNovel(novelId: string) {
        const result = await this.db.execute(
            `SELECT c.id, c.novel_id, c.user_id, c.role, c.joined_at, u.email, u.nickname
             FROM COLLABORATIONS c
             JOIN USERS u ON c.user_id = u.id
             WHERE c.novel_id = :novel_id
             ORDER BY c.joined_at DESC`,
            { novel_id: novelId },
        );
        return (result.rows as any[]).map(row => ({
            id: row.ID,
            novel_id: row.NOVEL_ID,
            user_id: row.USER_ID,
            email: row.EMAIL,
            nickname: row.NICKNAME,
            role: row.ROLE,
            joined_at: row.JOINED_AT,
        }));
    }

    async findOne(id: string) {
        const result = await this.db.execute(
            `SELECT c.id, c.novel_id, c.user_id, c.role, c.joined_at, u.email, u.nickname
             FROM COLLABORATIONS c
             JOIN USERS u ON c.user_id = u.id
             WHERE c.id = :id`,
            { id },
        );
        const row = (result.rows as any[])?.[0];
        if (!row) throw new NotFoundException('Collaboration not found');
        return {
            id: row.ID,
            novel_id: row.NOVEL_ID,
            user_id: row.USER_ID,
            email: row.EMAIL,
            nickname: row.NICKNAME,
            role: row.ROLE,
            joined_at: row.JOINED_AT,
        };
    }

    async update(id: string, dto: UpdateCollaborationDto) {
        if (!dto.role) return this.findOne(id);
        await this.db.execute(
            `UPDATE COLLABORATIONS SET role = :role WHERE id = :id`,
            { id, role: dto.role },
        );
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.db.execute(`DELETE FROM COLLABORATIONS WHERE id = :id`, { id });
        return { deleted: true };
    }
}
