import { IsOptional, IsString } from 'class-validator';

export class CreateMapDto {
    @IsOptional()
    @IsString()
    image_url?: string;

    @IsOptional()
    metadata?: any;
}

export class UpdateMapDto {
    @IsOptional()
    @IsString()
    image_url?: string;

    @IsOptional()
    metadata?: any;
}
