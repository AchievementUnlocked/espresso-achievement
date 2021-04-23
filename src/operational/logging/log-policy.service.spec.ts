import { Test, TestingModule } from '@nestjs/testing';

import { LogPolicyService } from '.';

describe('LogPolicyService', () => {
  let service: LogPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogPolicyService],
    }).compile();

    service = module.get<LogPolicyService>(LogPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
