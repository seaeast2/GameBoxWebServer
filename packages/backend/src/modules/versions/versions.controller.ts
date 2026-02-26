import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { JwtAuthGuard } from '../../common/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class VersionsController {
    constructor(private readonly versionsService: VersionsService) { }

    @Get('novels/:novelId/versions')
    async findAllByNovel(@Param('novelId') novelId: string) {
        return this.versionsService.findAllByNovel(novelId);
    }

    @Get('versions/:id')
    async findOne(@Param('id') id: string) {
        return this.versionsService.findOne(id);
    }

    @Post('versions/:id/restore')
    async restore(@Param('id') id: string) {
        return this.versionsService.restore(id);
    }
}
