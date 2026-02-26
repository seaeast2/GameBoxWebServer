import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTimelineDto {
    @IsNumber()
    episode!: number;

    @IsOptional()
    @IsString()
    summary?: string;
}

export class UpdateTimelineDto {
    @IsOptional()
    @IsNumber()
    episode?: number;

    @IsOptional()
    @IsString()
    summary?: string;
}
