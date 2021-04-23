import { Test, TestingModule } from '@nestjs/testing';
import { AchievementRepository } from './achievement.repository';

describe('AchievementRespository', () => {
  let provider: AchievementRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementRepository],
    }).compile();

    provider = module.get<AchievementRepository>(AchievementRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
