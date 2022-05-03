import { Test, TestingModule } from '@nestjs/testing';
import { SkillMongoDbProvider } from './skill-mongodb.provider';

describe('SkillMongoDbProvider', () => {
  let provider: SkillMongoDbProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillMongoDbProvider],
    }).compile();

    provider = module.get<SkillMongoDbProvider>(SkillMongoDbProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
