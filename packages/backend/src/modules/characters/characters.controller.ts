import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto, UpdateCharacterDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class CharactersController {
    constructor(private readonly charactersService: CharactersService) { }

    @Post('novels/:novelId/characters')
    async create(
        @Param('novelId') novelId: string,
        @Body() dto: CreateCharacterDto,
    ) {
        return this.charactersService.create(novelId, dto);
    }

    @Get('novels/:novelId/characters')
    async findAllByNovel(@Param('novelId') novelId: string) {
        return this.charactersService.findAllByNovel(novelId);
    }

    @Get('characters/:id')
    async findOne(@Param('id') id: string) {
        return this.charactersService.findOne(id);
    }

    @Patch('characters/:id')
    async update(@Param('id') id: string, @Body() dto: UpdateCharacterDto) {
        return this.charactersService.update(id, dto);
    }

    @Delete('characters/:id')
    async remove(@Param('id') id: string) {
        return this.charactersService.remove(id);
    }
}
