import { Module } from '@nestjs/common';
import { ForeshadowsController } from './foreshadows.controller';
import { ForeshadowsService } from './foreshadows.service';

@Module({
    controllers: [ForeshadowsController],
    providers: [ForeshadowsService],
    exports: [ForeshadowsService],
})
export class ForeshadowsModule { }
