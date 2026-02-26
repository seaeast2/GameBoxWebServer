import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MapsService } from './maps.service';
import { CreateMapDto, UpdateMapDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class MapsController {
    constructor(private readonly mapsService: MapsService) { }

    @Post('novels/:novelId/maps')
    async create(@Param('novelId') novelId: string, @Body() dto: CreateMapDto) {
        return this.mapsService.create(novelId, dto);
    }

    @Get('novels/:novelId/maps')
    async findAllByNovel(@Param('novelId') novelId: string) {
        return this.mapsService.findAllByNovel(novelId);
    }

    @Patch('maps/:id')
    async update(@Param('id') id: string, @Body() dto: UpdateMapDto) {
        return this.mapsService.update(id, dto);
    }

    @Delete('maps/:id')
    async remove(@Param('id') id: string) {
        return this.mapsService.remove(id);
    }
}
