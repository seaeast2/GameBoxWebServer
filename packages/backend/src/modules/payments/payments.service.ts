import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { SubscribeDto } from './dto';

@Injectable()
export class PaymentsService {
    constructor(private readonly db: DatabaseService) { }

    async subscribe(userId: string, dto: SubscribeDto) {
        // Cancel existing active subscriptions
        await this.db.execute(
            `UPDATE PAYMENTS SET status = 'cancelled' WHERE user_id = :user_id AND status = 'active'`,
            { user_id: userId },
        );

        const id = uuidv4();
        await this.db.execute(
            `INSERT INTO PAYMENTS (id, user_id, plan, status, started_at, expired_at)
             VALUES (:id, :user_id, :plan, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30' DAY)`,
            {
                id,
                user_id: userId,
                plan: dto.plan,
            },
        );

        return this.getStatus(userId);
    }

    async getStatus(userId: string) {
        const result = await this.db.execute(
            `SELECT id, user_id, plan, status, started_at, expired_at
             FROM PAYMENTS
             WHERE user_id = :user_id
             ORDER BY started_at DESC
             FETCH FIRST 1 ROWS ONLY`,
            { user_id: userId },
        );
        const row = (result.rows as any[])?.[0];
        if (!row) {
            return {
                plan: 'free',
                status: 'none',
                started_at: null,
                expired_at: null,
            };
        }
        return {
            payment_id: row.ID,
            plan: row.PLAN,
            status: row.STATUS,
            started_at: row.STARTED_AT,
            expired_at: row.EXPIRED_AT,
        };
    }

    async cancel(userId: string) {
        await this.db.execute(
            `UPDATE PAYMENTS SET status = 'cancelled' WHERE user_id = :user_id AND status = 'active'`,
            { user_id: userId },
        );
        return { status: 'cancelled' };
    }
}
