import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { HandlersModule, QueryHandlers } from 'qry/handlers';
import { AchievementQryController } from 'qry/controllers';

@Module({
  imports: [
    CqrsModule,
    OperationalConfigModule,
    OperationalLoggingModule,
    OperationalErrorModule,
    HandlersModule
  ],
  exports: [
    AchievementQryController,
  ],
  providers: [
    ConfigPolicyService,
    LogPolicyService,
    ErrorPolicyService,
    ...QueryHandlers
  ]
})
export class ControllersModule { }
