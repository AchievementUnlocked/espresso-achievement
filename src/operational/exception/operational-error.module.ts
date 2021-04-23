import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OperationalConfigModule, ConfigPolicyService } from '../configuration';
import { OperationalLoggingModule, LogPolicyService } from '../logging';

import { ErrorPolicyService } from '.';

@Module({
  imports: [
    OperationalConfigModule,
    OperationalLoggingModule,
  ],
  exports: [
    ErrorPolicyService,
  ],
  providers: [
    ConfigService,
    ConfigPolicyService,
    LogPolicyService,
    ErrorPolicyService,
  ],
})
export class OperationalErrorModule { }
