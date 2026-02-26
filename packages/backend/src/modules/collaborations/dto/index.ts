import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollaborationDto {
    @IsEmail()
    user_email!: string;

    @IsOptional()
    @IsString()
    role?: string; // 'editor' | 'viewer'
}

export class UpdateCollaborationDto {
    @IsOptional()
    @IsString()
    role?: string;
}
