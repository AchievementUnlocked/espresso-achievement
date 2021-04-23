import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { AchievementFullDto, AchievementFullSchema, SkillFullDto, SkillFullSchema, UserProfileFullDto, UserProfileFullSchema } from 'domain/schemas';
import { AchievementMongoDBProvider, UserProfileMongoDBProvider, AchievementAzblobProvider, SkillCacheProvider, SkillMongoDbProvider, MongodbConfigService } from 'cmd/repositories/data-providers';

import { AchievementRepository, UserProfileRepository, SkillRepository } from 'cmd/repositories';

@Module({
    imports: [
        OperationalConfigModule,
        OperationalLoggingModule,
        OperationalErrorModule,

        CacheModule.register(),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_CONNECTION_STRING'),
                useCreateIndex: true,
                dbName: configService.get<string>('MONGO_DBNAME'),
            }),
            inject: [ConfigService]
        }),

        MongooseModule.forFeature([{ name: AchievementFullDto.name, schema: AchievementFullSchema }]),
        MongooseModule.forFeature([{ name: UserProfileFullDto.name, schema: UserProfileFullSchema }]),
        MongooseModule.forFeature([{ name: SkillFullDto.name, schema: SkillFullSchema }]),
    ],
    providers: [
        ConfigService,
        ConfigPolicyService,
        LogPolicyService,
        ErrorPolicyService,
        AchievementRepository,
        AchievementMongoDBProvider,
        AchievementAzblobProvider,
        UserProfileRepository,
        UserProfileMongoDBProvider,
        SkillRepository,
        SkillCacheProvider,
        SkillMongoDbProvider
    ],
    exports: [
        AchievementRepository,
        AchievementMongoDBProvider,
        AchievementAzblobProvider,
        UserProfileRepository,
        UserProfileMongoDBProvider,
        SkillRepository,
        SkillCacheProvider,
        SkillMongoDbProvider
    ]
})

export class RepositoryModule { }
