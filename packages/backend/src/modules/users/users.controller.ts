import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser } from '../../common/decorators';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@CurrentUser('userId') userId: string) {
        return this.usersService.getMe(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateMe(
        @CurrentUser('userId') userId: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.updateMe(userId, dto);
    }
}
