import { Test, TestingModule } from '@nestjs/testing';
import { AchievementAclController } from './achievement-acl.controller';

describe('AchievementAclController', () => {
  let controller: AchievementAclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementAclController],
    }).compile();

    controller = module.get<AchievementAclController>(AchievementAclController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
