import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CqrsModule } from '@nestjs/cqrs';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { AchievementRepository, RepositoryModule } from 'qry/repositories';

import { QueryHandlers } from './query-handlers';
import { EventHandlers } from './event-handlers';

@Module({
    imports: [
        HttpModule,
        CqrsModule,
        OperationalConfigModule,
        OperationalLoggingModule,
        OperationalErrorModule,
        RepositoryModule
    ],
    providers: [
        ConfigPolicyService,
        LogPolicyService,
        ErrorPolicyService,
        AchievementRepository,
        ...QueryHandlers,
        ...EventHandlers
    ],
    exports: [
    ]
})
export class HandlersModule { }
