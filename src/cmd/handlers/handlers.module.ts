import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { AchievementRepository, RepositoryModule } from 'cmd/repositories';

import { CommandHandlers } from './command-handlers';
import { EventHandlers } from './event-handlers';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    OperationalConfigModule,
    OperationalLoggingModule,
    OperationalErrorModule,
    RepositoryModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'kafka-cmd-client',
        useFactory: async (configService: ConfigService) => ({

          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CMD_CLIENT_ID'),
              brokers: [configService.get<string>('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_CMD_GROUP_ID'),
            },
          },

        }),
        inject: [ConfigService]
      }
    ]),
  ],
  providers: [
    ConfigService,
    ConfigPolicyService,
    LogPolicyService,
    ErrorPolicyService,
    AchievementRepository,
    ...CommandHandlers,
    ...EventHandlers
  ],
  exports: [
  ]
})
export class HandlersModule { }
