import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule, DatabaseService } from './common/database';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NovelsModule } from './modules/novels/novels.module';
import { CharactersModule } from './modules/characters/characters.module';
import { WorldsModule } from './modules/worlds/worlds.module';
import { MapsModule } from './modules/maps/maps.module';
import { TimelinesModule } from './modules/timelines/timelines.module';
import { ForeshadowsModule } from './modules/foreshadows/foreshadows.module';
import { CollaborationsModule } from './modules/collaborations/collaborations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { VersionsModule } from './modules/versions/versions.module';
import { EpisodesModule } from './modules/episodes/episodes.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        DatabaseModule,
        AuthModule,
        UsersModule,
        NovelsModule,
        CharactersModule,
        WorldsModule,
        MapsModule,
        TimelinesModule,
        ForeshadowsModule,
        CollaborationsModule,
        PaymentsModule,
        VersionsModule,
        EpisodesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements OnModuleInit {
    constructor(private readonly databaseService: DatabaseService) { }

    async onModuleInit() {
        // Initialize database tables on startup
        await this.databaseService.initializeTables();
    }
}
