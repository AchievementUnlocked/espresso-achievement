import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { HandlersModule as QryHandlersModule } from 'qry/handlers';

import { OperationalLoggingModule } from 'operational/logging';
import { OperationalErrorModule } from 'operational/exception';
import { OperationalConfigModule } from 'operational/configuration';

import { AchievementQryController } from 'qry/api';
import { AchievementAclController } from 'qry/acl';

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
    QryHandlersModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'kafka-qry-client',
        useFactory: async (configService: ConfigService) => ({

          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_QRY_CLIENT_ID'),
              brokers: [configService.get<string>('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_QRY_GROUP_ID'),
            },
          },

        }),
        inject: [ConfigService]
      }
    ]),
  ],
  controllers: [
    AchievementQryController,
    AchievementAclController
  ],
  providers: [
  ]
})
export class AppQryModule {}
