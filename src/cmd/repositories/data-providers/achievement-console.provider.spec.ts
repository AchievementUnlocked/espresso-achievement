import { Test, TestingModule } from '@nestjs/testing';

import { AchievementConsoleDbProvider } from '.';

describe('AchievementConsoleDbProvider', () => {
  let provider: AchievementConsoleDbProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementConsoleDbProvider],
    }).compile();

    provider = module.get<AchievementConsoleDbProvider>(AchievementConsoleDbProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
