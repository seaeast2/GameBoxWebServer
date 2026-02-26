import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCharacterDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsNumber()
    level?: number;

    @IsOptional()
    stats?: any;

    @IsOptional()
    items?: any;
}
