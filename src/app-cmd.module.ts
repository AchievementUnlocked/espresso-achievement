import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AchievementCmdController } from 'cmd/api';
import { AchievementAclController } from 'cmd/acl';
import { HandlersModule as CmdHandlersModule } from 'cmd/handlers';

import { OperationalConfigModule } from 'operational/configuration';
import { OperationalLoggingModule } from 'operational/logging';
import { OperationalErrorModule } from 'operational/exception';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/${process.env.NODE_ENV}.env`
    }),
    CqrsModule,
    OperationalConfigModule,
    OperationalLoggingModule,
    OperationalErrorModule,
    CmdHandlersModule,
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
  controllers: [
    AchievementCmdController,
    AchievementAclController
  ],
  providers: [
  ]
})
export class AppCmdModule { }
