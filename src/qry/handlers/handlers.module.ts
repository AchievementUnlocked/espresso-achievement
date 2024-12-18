import { HttpModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { AchievementRepository, RepositoryModule } from 'qry/repositories';

import { QueryHandlers } from 'qry/handlers/query-handlers';

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
        ...QueryHandlers
    ],
    exports: [
    ]
})
export class HandlersModule { }
