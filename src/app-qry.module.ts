import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { AchievementQryController } from 'qry/controllers';
import { HandlersModule as QryHandlersModule } from 'qry/handlers';

import { OperationalLoggingModule } from 'operational/logging';
import { OperationalErrorModule } from 'operational/exception';
import { OperationalConfigModule } from 'operational/configuration';

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
    QryHandlersModule
  ],
  controllers: [
    AchievementQryController,
  ],
  providers: [
  ]
})
export class AppQryModule {}
