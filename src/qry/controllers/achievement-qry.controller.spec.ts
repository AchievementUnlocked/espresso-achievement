import { Test, TestingModule } from '@nestjs/testing';

import { AchievementQryController } from './achievement-qry.controller';

describe('Achievement Controller', () => {
  let controller: AchievementQryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementQryController],
    }).compile();

    controller = module.get<AchievementQryController>(AchievementQryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
