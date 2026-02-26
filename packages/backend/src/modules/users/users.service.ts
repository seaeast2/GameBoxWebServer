import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../common/database';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
    constructor(private readonly db: DatabaseService) { }

    async getMe(userId: string) {
        const result = await this.db.execute(
            `SELECT id, email, nickname, role, created_at FROM USERS WHERE id = :id`,
            { id: userId },
        );
        const user = (result.rows as any[])?.[0];
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            id: user.ID,
            email: user.EMAIL,
            nickname: user.NICKNAME,
            role: user.ROLE,
            created_at: user.CREATED_AT,
        };
    }

    async updateMe(userId: string, dto: UpdateUserDto) {
        const setClauses: string[] = [];
        const binds: any = { id: userId };

        if (dto.nickname) {
            setClauses.push('nickname = :nickname');
            binds.nickname = dto.nickname;
        }
        if (dto.password) {
            setClauses.push('password = :password');
            binds.password = await bcrypt.hash(dto.password, 10);
        }

        if (setClauses.length === 0) {
            return this.getMe(userId);
        }

        await this.db.execute(
            `UPDATE USERS SET ${setClauses.join(', ')} WHERE id = :id`,
            binds,
        );

        return this.getMe(userId);
    }
}
