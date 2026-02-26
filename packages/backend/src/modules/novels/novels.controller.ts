import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { NovelsService } from './novels.service';
import { CreateNovelDto, UpdateNovelDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser } from '../../common/decorators';

@Controller('novels')
@UseGuards(JwtAuthGuard)
export class NovelsController {
    constructor(private readonly novelsService: NovelsService) { }

    @Post()
    async create(
        @CurrentUser('userId') userId: string,
        @Body() dto: CreateNovelDto,
    ) {
        return this.novelsService.create(userId, dto);
    }

    @Get()
    async findAll(@CurrentUser('userId') userId: string) {
        return this.novelsService.findAll(userId);
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @CurrentUser('userId') userId: string,
    ) {
        return this.novelsService.findOne(id, userId);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @CurrentUser('userId') userId: string,
        @Body() dto: UpdateNovelDto,
    ) {
        return this.novelsService.update(id, userId, dto);
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @CurrentUser('userId') userId: string,
    ) {
        return this.novelsService.remove(id, userId);
    }
}
