import { Test, TestingModule } from '@nestjs/testing';
import { SkillCacheProvider } from './skill-cache.provider';

describe('SkillCacheProvider', () => {
  let provider: SkillCacheProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillCacheProvider],
    }).compile();

    provider = module.get<SkillCacheProvider>(SkillCacheProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
