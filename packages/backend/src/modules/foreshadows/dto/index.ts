import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateForeshadowDto {
    @IsString()
    @IsNotEmpty()
    description!: string;
}

export class UpdateForeshadowDto {
    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    resolved?: string; // 'Y' or 'N'
}
