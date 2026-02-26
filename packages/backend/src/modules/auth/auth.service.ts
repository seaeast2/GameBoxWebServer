import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database';
import { SignupDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly db: DatabaseService,
        private readonly jwtService: JwtService,
    ) { }

    async signup(dto: SignupDto) {
        // Check if email already exists
        const existing = await this.db.execute(
            `SELECT id FROM USERS WHERE email = :email`,
            { email: dto.email },
        );
        if (existing.rows && (existing.rows as any[]).length > 0) {
            throw new ConflictException('Email already registered');
        }

        const id = uuidv4();
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        await this.db.execute(
            `INSERT INTO USERS (id, email, password, nickname, role, created_at)
             VALUES (:id, :email, :password, :nickname, 'user', CURRENT_TIMESTAMP)`,
            {
                id,
                email: dto.email,
                password: hashedPassword,
                nickname: dto.nickname,
            },
        );

        const token = this.jwtService.sign({
            sub: id,
            email: dto.email,
            role: 'user',
        });

        return {
            id,
            email: dto.email,
            nickname: dto.nickname,
            access_token: token,
            created_at: new Date().toISOString(),
        };
    }

    async login(dto: LoginDto) {
        const result = await this.db.execute(
            `SELECT id, email, password, nickname, role FROM USERS WHERE email = :email`,
            { email: dto.email },
        );

        const user = (result.rows as any[])?.[0];
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(dto.password, user.PASSWORD);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({
            sub: user.ID,
            email: user.EMAIL,
            role: user.ROLE,
        });

        return {
            id: user.ID,
            email: user.EMAIL,
            nickname: user.NICKNAME,
            role: user.ROLE,
            access_token: token,
        };
    }
}
