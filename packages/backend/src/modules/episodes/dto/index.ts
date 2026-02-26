import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveEpisodeTextDto {
    @IsString()
    @IsNotEmpty()
    content!: string;
}

export class UpdateEpisodeTextDto {
    @IsString()
    @IsNotEmpty()
    content!: string;
}
