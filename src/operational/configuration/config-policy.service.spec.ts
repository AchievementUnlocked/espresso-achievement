import { Test, TestingModule } from '@nestjs/testing';

import { ConfigPolicyService } from '.';

describe('ConfigPolicyService', () => {
  let service: ConfigPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigPolicyService],
    }).compile();

    service = module.get<ConfigPolicyService>(ConfigPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
