import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WorldsService } from './worlds.service';
import { CreateWorldDto, UpdateWorldDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class WorldsController {
    constructor(private readonly worldsService: WorldsService) { }

    @Post('novels/:novelId/worlds')
    async create(@Param('novelId') novelId: string, @Body() dto: CreateWorldDto) {
        return this.worldsService.create(novelId, dto);
    }

    @Get('novels/:novelId/worlds')
    async findAllByNovel(@Param('novelId') novelId: string) {
        return this.worldsService.findAllByNovel(novelId);
    }

    @Patch('worlds/:id')
    async update(@Param('id') id: string, @Body() dto: UpdateWorldDto) {
        return this.worldsService.update(id, dto);
    }

    @Delete('worlds/:id')
    async remove(@Param('id') id: string) {
        return this.worldsService.remove(id);
    }
}
