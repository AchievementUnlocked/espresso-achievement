import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { HandlersModule, CommandHandlers, EventHandlers } from 'cmd/handlers';
import { AchievementCmdController } from 'cmd/controllers';

@Module({
  imports: [
    CqrsModule,
    OperationalConfigModule,
    OperationalLoggingModule,
    OperationalErrorModule,
    HandlersModule
  ],
  exports: [
    AchievementCmdController
  ],
  providers: [
    ConfigService,
    ConfigPolicyService,
    LogPolicyService,
    ErrorPolicyService,
    ...CommandHandlers,
    ...EventHandlers

  ]
})
export class ControllersModule { }
