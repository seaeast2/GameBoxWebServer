import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCharacterDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    level?: number;

    @IsOptional()
    stats?: any;

    @IsOptional()
    items?: any;
}
