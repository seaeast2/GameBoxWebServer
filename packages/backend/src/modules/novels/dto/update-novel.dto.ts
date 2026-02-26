import { IsOptional, IsString } from 'class-validator';

export class UpdateNovelDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    genre?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    is_collab?: string;
}
