import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNovelDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsOptional()
    @IsString()
    genre?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
