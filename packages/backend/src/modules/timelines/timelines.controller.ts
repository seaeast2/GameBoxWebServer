import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { CreateTimelineDto, UpdateTimelineDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class TimelinesController {
    constructor(private readonly timelinesService: TimelinesService) { }

    @Post('novels/:novelId/timelines')
    async create(@Param('novelId') novelId: string, @Body() dto: CreateTimelineDto) {
        return this.timelinesService.create(novelId, dto);
    }

    @Get('novels/:novelId/timelines')
    async findAllByNovel(@Param('novelId') novelId: string) {
        return this.timelinesService.findAllByNovel(novelId);
    }

    @Get('timelines/:id')
    async findOne(@Param('id') id: string) {
        return this.timelinesService.findOne(id);
    }

    @Patch('timelines/:id')
    async update(@Param('id') id: string, @Body() dto: UpdateTimelineDto) {
        return this.timelinesService.update(id, dto);
    }

    @Delete('timelines/:id')
    async remove(@Param('id') id: string) {
        return this.timelinesService.remove(id);
    }
}
