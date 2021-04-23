import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigPolicyService } from '.';

@Module({
  providers: [
    ConfigService,
    ConfigPolicyService,
  ],
  exports: [ConfigPolicyService],
})
export class OperationalConfigModule {}
