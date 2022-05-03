import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { AchievementFullDto, AchievementFullSchema, SkillFullDto, SkillFullSchema, UserProfileFullDto, UserProfileFullSchema } from 'domain/schemas';
import { AchievementMongoDbProvider, UserProfileMongoDBProvider, SkillCacheProvider, SkillMongoDbProvider, MongodbConfigService } from 'qry/repositories/data-providers';

import { AchievementRepository,SkillRepository, UserProfileRepository } from 'qry/repositories';

@Module({
    imports: [
        OperationalConfigModule,
        OperationalLoggingModule,
        OperationalErrorModule,

        CacheModule.register(),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_QRY_CONNECTION_STRING'),
                dbName: configService.get<string>('MONGO_QRY_DBNAME'),
            }),
            inject: [ConfigService]
        }),

        MongooseModule.forFeature([{ name: AchievementFullDto.name, schema: AchievementFullSchema }]),
        MongooseModule.forFeature([{ name: UserProfileFullDto.name, schema: UserProfileFullSchema }]),
        MongooseModule.forFeature([{ name: SkillFullDto.name, schema: SkillFullSchema }]),
    ],
    providers: [
        ConfigPolicyService,
        LogPolicyService,
        ErrorPolicyService,
        AchievementRepository,
        AchievementMongoDbProvider,
        UserProfileRepository,
        UserProfileMongoDBProvider,
        SkillRepository,
        SkillCacheProvider,
        SkillMongoDbProvider
    ],
    exports: [
        AchievementRepository,
        AchievementMongoDbProvider,
        UserProfileRepository,
        UserProfileMongoDBProvider,
        SkillRepository,
        SkillCacheProvider,
        
        SkillMongoDbProvider
    ]
})
export class RepositoryModule { }
