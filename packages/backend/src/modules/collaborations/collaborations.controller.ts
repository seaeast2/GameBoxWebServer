import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CollaborationsService } from './collaborations.service';
import { CreateCollaborationDto, UpdateCollaborationDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class CollaborationsController {
    constructor(private readonly collaborationsService: CollaborationsService) { }

    @Post('novels/:novelId/collaborators')
    async create(@Param('novelId') novelId: string, @Body() dto: CreateCollaborationDto) {
        return this.collaborationsService.create(novelId, dto);
    }

    @Get('novels/:novelId/collaborators')
    async findAllByNovel(@Param('novelId') novelId: string) {
        return this.collaborationsService.findAllByNovel(novelId);
    }

    @Patch('collaborators/:id')
    async update(@Param('id') id: string, @Body() dto: UpdateCollaborationDto) {
        return this.collaborationsService.update(id, dto);
    }

    @Delete('collaborators/:id')
    async remove(@Param('id') id: string) {
        return this.collaborationsService.remove(id);
    }
}
