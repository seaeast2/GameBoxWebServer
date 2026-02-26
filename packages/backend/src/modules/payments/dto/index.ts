import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubscribeDto {
    @IsString()
    @IsNotEmpty()
    plan!: string; // 'free' | 'premium' | 'team'
}
