import { Test, TestingModule } from '@nestjs/testing';

import { AchievementMongoDBProvider } from '.';

describe('AchievementProvider', () => {
  let provider: AchievementMongoDBProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementMongoDBProvider],
    }).compile();

    provider = module.get<AchievementMongoDBProvider>(AchievementMongoDBProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
