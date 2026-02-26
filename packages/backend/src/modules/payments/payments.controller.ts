import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { SubscribeDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser } from '../../common/decorators';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('subscribe')
    async subscribe(
        @CurrentUser('userId') userId: string,
        @Body() dto: SubscribeDto,
    ) {
        return this.paymentsService.subscribe(userId, dto);
    }

    @Get('status')
    async getStatus(@CurrentUser('userId') userId: string) {
        return this.paymentsService.getStatus(userId);
    }

    @Post('cancel')
    async cancel(@CurrentUser('userId') userId: string) {
        return this.paymentsService.cancel(userId);
    }
}
