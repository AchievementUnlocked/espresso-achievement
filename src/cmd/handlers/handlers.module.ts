import { HttpModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

import { OperationalConfigModule, ConfigPolicyService } from 'operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from 'operational/logging';
import { OperationalErrorModule, ErrorPolicyService } from 'operational/exception';

import { AchievementRepository, RepositoryModule } from '../repositories';

import { CommandHandlers } from './command-handlers';
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
