import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { AchievementFullDto, AchievementFullSchema } from 'domain/schemas';
import { AchievementMongoDbProvider } from 'qry/repositories/data-providers';

import { AchievementRepository } from 'qry/repositories';

@Module({
  imports: [
    OperationalConfigModule,
    OperationalLoggingModule,
    OperationalErrorModule,

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
],
providers: [
    ConfigPolicyService,
    LogPolicyService,
    ErrorPolicyService,
    AchievementRepository,
    AchievementMongoDbProvider
],
exports: [
    AchievementRepository,
    AchievementMongoDbProvider,
]
})
export class RepositoryModule {}
