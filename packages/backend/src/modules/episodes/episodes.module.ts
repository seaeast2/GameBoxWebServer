import { Module } from '@nestjs/common';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { VersionsModule } from '../versions/versions.module';

@Module({
    imports: [VersionsModule],
    controllers: [EpisodesController],
    providers: [EpisodesService],
    exports: [EpisodesService],
})
export class EpisodesModule { }
