import { Test, TestingModule } from '@nestjs/testing';
import { CommonRepository } from './common.repository';

describe('CommonRespository', () => {
  let provider: CommonRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonRepository],
    }).compile();

    provider = module.get<CommonRepository>(CommonRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
