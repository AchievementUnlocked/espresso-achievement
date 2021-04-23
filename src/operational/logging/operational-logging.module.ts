import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OperationalConfigModule, ConfigPolicyService } from '../configuration';

import { LogRequestInterceptor, LogPolicyService } from '.';

@Module({
  imports: [OperationalConfigModule],
  providers: [
    ConfigService,
    ConfigPolicyService,
    LogPolicyService,
    LogRequestInterceptor,
  ],
  exports: [
    LogPolicyService,
    LogRequestInterceptor,
  ],
})

export class OperationalLoggingModule { }
