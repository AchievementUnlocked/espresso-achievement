import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { Buffer } from 'buffer';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';
import { ErrorPolicyService } from 'operational/exception';

import { CreateAchievementCommand, CreateAchievementMediaCommand } from 'domain/commands';
import { Achievement } from 'domain/entities';

import { AchievementRepository, UserProfileRepository } from 'cmd/repositories';

import { CreateAchievementCommandHandler } from './create-achievement-command.handler';

/*
describe('CreateAchievementCommandHandler', () => {
  it('should be defined', () => {

    const configPolicy = new ConfigPolicyService();
    const logPolicy = new LogPolicyService(configPolicy);
    const errorPolicy = new ErrorPolicyService(logPolicy);

    const model = new Model();

    const achievementMongodbProvider = new AchievementMongoDBProvider(logPolicy, model);
    const userProfileMongodbProvider = new UserProfileMongoDBProvider(logPolicy, model);
    const azblobProvider = new AchievementAzblobProvider(configPolicy, logPolicy);
    const achievementReposiory = new AchievementRepository(logPolicy, achievementMongodbProvider, azblobProvider);
    const userProfileRepository = new UserProfileRepository(logPolicy, userProfileMongodbProvider);

    expect(new CreateAchievementCommandHandler(logPolicy, errorPolicy, achievementReposiory, userProfileRepository)).toBeDefined();
  });
});
*/

describe('Create Achievement Command Handler', () => {
  let app: TestingModule;
  let commandHandler: CreateAchievementCommandHandler;

  const mockAchievementRepository = {
    saveAchievement: (entity) => new Promise((resolve) => {

      // TODO: Build a sample domain entity
      const response = new Achievement('123abc');

      resolve(response);
    })
  };

  const mockUserProfileRepository = {
    getUserProfile: (userName) => new Promise((resolve) => {

      // TODO: Build a sample domain entity
      const response = {};

      resolve(response);
    })
  };

  beforeAll(async () => {
    try {
      const moduleBuilder = await Test.createTestingModule({
        providers: [
          CreateAchievementCommandHandler,
          ConfigPolicyService,
          LogPolicyService,
          ErrorPolicyService,
          AchievementRepository,
          UserProfileRepository],
      });

      moduleBuilder.overrideProvider(AchievementRepository)
        .useValue(mockAchievementRepository);

      moduleBuilder.overrideProvider(UserProfileRepository)
        .useValue(mockUserProfileRepository);

      app = await moduleBuilder.compile();

      commandHandler = app.get<CreateAchievementCommandHandler>(CreateAchievementCommandHandler);
    } catch (error) {
      throw error;
    }

  });

  it('Should be defined', () => {
    expect(commandHandler).toBeDefined();
  });

  it('Map To Entity - Verify possitive response', async () => {

    // Create mock objects
    const command = new CreateAchievementCommand();
    command.title = 'test title';
    command.description = 'test description';
    command.completedDate = new Date();
    command.skills = ['str', 'dex', 'con'];
    command.visibility = 1;
    command.userName = 'test user name';
    command.media = new Array<CreateAchievementMediaCommand>();

    const mediaCommand = new CreateAchievementMediaCommand(
      Buffer.from('hello'),
      'image/jpeg',
      'hello.txt',
      64);

    command.media.push(mediaCommand);

    const entity = await commandHandler.mapToEntity(command);

    // Validate scenario
    expect(entity.title).toBe(command.title);
    expect(entity.description).toBe(command.description);
    expect(entity.completedDate).toBe(command.completedDate);
    expect(entity.visibility).toBe(command.visibility);

  });

});

/*
const mediaEntity = new AchievementMedia(CodeGeneratorUtil.GenerateShortCode());

// Get the extension from the mmime type of teh file
const extension = MimeTypeUtil.getExtension(val.mimeType);

mediaEntity.mediaPath = `${entity.getId()}/${mediaEntity.getId()}_${idx}.${extension}`;
mediaEntity.originalName = val.originalName;
mediaEntity.mimeType = val.mimeType;
mediaEntity.size = val.size;
mediaEntity.encoding = val.encoding;
mediaEntity.buffer = val.buffer;
*/
