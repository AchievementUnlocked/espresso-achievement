import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { HandlersModule, QueryHandlers, EventHandlers } from 'qry/handlers';
import { AchievementQryController } from 'qry/api';
import { AchievementAclController } from 'qry/acl';


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
    AchievementAclController
  ],
  providers: [
    ConfigPolicyService,
    LogPolicyService,
    ErrorPolicyService,
    ...QueryHandlers,
    ...EventHandlers
  ]
})
export class ControllersModule { }
