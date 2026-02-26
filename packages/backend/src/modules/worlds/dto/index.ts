import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorldDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    metadata?: any;
}

export class UpdateWorldDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    metadata?: any;
}
