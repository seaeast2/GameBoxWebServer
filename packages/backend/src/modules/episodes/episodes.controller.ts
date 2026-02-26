import { Controller, Get, Post, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { SaveEpisodeTextDto, UpdateEpisodeTextDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';

@Controller('novels/:novelId/episodes/:episode')
@UseGuards(JwtAuthGuard)
export class EpisodesController {
    constructor(private readonly episodesService: EpisodesService) { }

    @Post('text')
    async saveText(
        @Param('novelId') novelId: string,
        @Param('episode', ParseIntPipe) episode: number,
        @Body() dto: SaveEpisodeTextDto,
    ) {
        return this.episodesService.saveText(novelId, episode, dto);
    }

    @Get('text')
    async getText(
        @Param('novelId') novelId: string,
        @Param('episode', ParseIntPipe) episode: number,
    ) {
        return this.episodesService.getText(novelId, episode);
    }

    @Patch('text')
    async updateText(
        @Param('novelId') novelId: string,
        @Param('episode', ParseIntPipe) episode: number,
        @Body() dto: UpdateEpisodeTextDto,
    ) {
        return this.episodesService.updateText(novelId, episode, dto);
    }

    @Get('versions')
    async getVersions(
        @Param('novelId') novelId: string,
        @Param('episode', ParseIntPipe) episode: number,
    ) {
        return this.episodesService.getVersions(novelId, episode);
    }

    @Post('restore/:versionId')
    async restoreVersion(
        @Param('novelId') novelId: string,
        @Param('episode', ParseIntPipe) episode: number,
        @Param('versionId') versionId: string,
    ) {
        return this.episodesService.restoreVersion(novelId, episode, versionId);
    }
}
