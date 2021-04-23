import { Test, TestingModule } from '@nestjs/testing';

import { ErrorPolicyService } from '.';

describe('ErrorPolicyService', () => {
  let service: ErrorPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorPolicyService],
    }).compile();

    service = module.get<ErrorPolicyService>(ErrorPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
