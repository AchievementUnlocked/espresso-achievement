import { Test, TestingModule } from '@nestjs/testing';
import { AchievementMongoDbProvider } from './achievement-mongodb.provider';

describe('AchievementMongodb', () => {
  let provider: AchievementMongoDbProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementMongoDbProvider],
    }).compile();

    provider = module.get<AchievementMongoDbProvider>(AchievementMongoDbProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
