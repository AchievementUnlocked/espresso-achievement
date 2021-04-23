import { Test, TestingModule } from '@nestjs/testing';

import { AchievementAzblobProvider } from '.';

describe('AchievementAzblobProvider', () => {
  let provider: AchievementAzblobProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementAzblobProvider],
    }).compile();

    provider = module.get<AchievementAzblobProvider>(AchievementAzblobProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
