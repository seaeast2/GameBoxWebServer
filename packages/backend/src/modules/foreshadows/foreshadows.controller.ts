import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ForeshadowsService } from './foreshadows.service';
import { CreateForeshadowDto, UpdateForeshadowDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class ForeshadowsController {
    constructor(private readonly foreshadowsService: ForeshadowsService) { }

    @Post('timelines/:timelineId/foreshadows')
    async create(@Param('timelineId') timelineId: string, @Body() dto: CreateForeshadowDto) {
        return this.foreshadowsService.create(timelineId, dto);
    }

    @Get('timelines/:timelineId/foreshadows')
    async findAllByTimeline(@Param('timelineId') timelineId: string) {
        return this.foreshadowsService.findAllByTimeline(timelineId);
    }

    @Patch('foreshadows/:id')
    async update(@Param('id') id: string, @Body() dto: UpdateForeshadowDto) {
        return this.foreshadowsService.update(id, dto);
    }

    @Delete('foreshadows/:id')
    async remove(@Param('id') id: string) {
        return this.foreshadowsService.remove(id);
    }
}
