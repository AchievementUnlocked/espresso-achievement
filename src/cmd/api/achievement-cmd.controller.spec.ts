
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateAchievementCommand } from 'domain/commands';
import { AchievementCmdController } from './achievement-cmd.controller';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';
import { ErrorPolicyService } from 'operational/exception';

import { Buffer } from 'buffer';

describe('Achievement Controller', () => {
  let app: TestingModule;
  let controller: AchievementCmdController;

  const mockCommandBus = {
    execute: () => new Promise((resolve) => {

      const handlerResponse = {
        isSuccess: true
      };

      resolve(handlerResponse);
    })
  };

  beforeAll(async () => {
    try {
      app = await Test.createTestingModule({
        providers: [
          AchievementCmdController,
          ConfigPolicyService,
          LogPolicyService,
          ErrorPolicyService,
          CommandBus],
      })
        .overrideProvider(CommandBus)
        .useValue(mockCommandBus)
        .compile();

      controller = app.get<AchievementCmdController>(AchievementCmdController);
    } catch (error) {
      throw error;
    }

  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Create Achievement - Verify positive response.', async () => {

    const command = new CreateAchievementCommand();

    const files = [{
      buffer: Buffer.from('hello'),
      encoding: '7bit',
      mimetype: 'application/json',
      originalname: 'hello.txt',
      size: 64
    }];

    const response = await controller.createAchievement(command, files);

    expect(response).toBeDefined();
  });

});
