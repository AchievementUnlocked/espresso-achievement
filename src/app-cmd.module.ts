import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { AchievementCmdController } from './cmd/api';
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
    CmdHandlersModule
  ],
  controllers: [
    AchievementCmdController
  ],
  providers: [
  ]
})
export class AppCmdModule { }
