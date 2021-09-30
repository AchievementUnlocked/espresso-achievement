import { ConfigService } from '@nestjs/config';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NotImplementedException } from '@nestjs/common';

import { ConfigPolicyService } from '../../../operational/configuration';
import { ErrorPolicyService, EntityNotFoundException, InvalidCommandException, AppException, AppExceptionReason } from '../../../operational/exception';
import { LogPolicyService } from '../../../operational/logging';

import { Achievement, AchievementMedia, AchievementMediaSchema, AchievementVisibility, Skill } from '../../../domain/entities';
import { UpdateAchievementContentCommand } from '../../../domain/commands';

import { CodeGeneratorUtil, MimeTypeUtil } from '../../../domain/utils';

import { AchievementRepository, UserProfileRepository, SkillRepository } from '../../../cmd/repositories';

import { HandlerResponse } from '../../../cmd/handlers';

import { UpdateAchievementContentCommandHandler } from './update-achievement-content-command.handler';


describe('Update Achievement Content Command Handler', () => {

  let eventBus: EventBus;
  let configPolicy: ConfigPolicyService;
  let logPolicy: LogPolicyService;
  let errorPolicy: ErrorPolicyService;
  let achievementRepository: AchievementRepository;
  let skillRepository: SkillRepository;

  let commandHandler: UpdateAchievementContentCommandHandler;

  let entity: Achievement;

  beforeAll(() => {
    configPolicy = new ConfigPolicyService(null);
    jest.spyOn(configPolicy, 'get').mockImplementation((key) => '1');

    logPolicy = new LogPolicyService(configPolicy);
    jest.spyOn(logPolicy, 'trace').mockImplementation((msg, ctx) => { });

    errorPolicy = new ErrorPolicyService(logPolicy);
    jest.spyOn(errorPolicy, 'handleError').mockImplementation((err) => { return new AppException('', AppExceptionReason.Unknown, null) });

    skillRepository = new SkillRepository(logPolicy, null, null);
    jest.spyOn(skillRepository, 'getSkills').mockImplementation(
      async () => [
        new Skill('str', '', ''), new Skill('dex', '', ''), new Skill('con', '', ''),
        new Skill('int', '', ''), new Skill('wis', '', ''), new Skill('cha', '', ''),
        new Skill('luc', '', '')
      ]);

    achievementRepository = new AchievementRepository(logPolicy, null, null);
  });

  describe('Constructor', () => {

    beforeAll(() => { });

    it('Should be defined', () => {

      expect(new UpdateAchievementContentCommandHandler(logPolicy, errorPolicy,null, null, null)).toBeDefined();
    });

  });



  describe('execute', () => {

    beforeAll(() => {

      commandHandler = new UpdateAchievementContentCommandHandler(logPolicy, errorPolicy, null, achievementRepository, skillRepository);

      entity = {
        key: '123ABC',
        title: 'entity title',
        description: 'entity description',
        completedDate: new Date('2012-01-01'),
        visibility: AchievementVisibility.Everyone,
        skills: [new Skill('str', '', ''), new Skill('dex', '', '')],
        media: null,
        timestamp: new Date(),
        userProfile: null
      };

    });

    // TEST: When a valid command is provided and the entity belonging to the command key is found
    // TEST: Then the command handler will merge the  entity with the command, save it and return the merged entity
    it('Should execute command handler when a valid command is provided', async () => {

      jest.spyOn(achievementRepository, 'getAchievementEntity').mockImplementation(
        async (key) => {
          entity.key = key;
          return entity;
        });

      jest.spyOn(achievementRepository, 'saveAchievementEntity').mockImplementation(async (entity) => { return entity; });
      jest.spyOn(achievementRepository, 'saveAchievementDto').mockImplementation(async (entity) => { return entity; });

      const command: UpdateAchievementContentCommand = {
        key: '123ABC',
        title: 'command title',
        description: 'command description',
        completedDate: new Date('2012-01-02'),
        visibility: AchievementVisibility.Fiends,
        skills: ['int', 'wis']
      }

      const response = await commandHandler.execute(command) as HandlerResponse;
      const savedEntity = response.data as Achievement;

      expect(response).toBeDefined();
      expect(savedEntity.title).toBe(command.title);
      expect(savedEntity.description).toBe(command.description);
      expect(savedEntity.completedDate).toBe(command.completedDate);
      expect(savedEntity.visibility).toBe(command.visibility);

      const mskills = savedEntity.skills.map((item) => { return item.key }).sort();
      const cskills = command.skills.sort();

      expect(mskills).toEqual(cskills);
    });

    // TEST: When a valid command is provided and the entity belonging to the command key is not found
    // TEST: Then the command handler will return aresponse with the entity not found error
    it('Should return response with an entity not found error when the entity is not found', async () => {

      jest.spyOn(achievementRepository, 'getAchievementEntity').mockImplementation(async (key) => { return null; });
      jest.spyOn(achievementRepository, 'saveAchievementEntity').mockImplementation(async (entity) => { return entity; });
      jest.spyOn(achievementRepository, 'saveAchievementDto').mockImplementation(async (entity) => { return entity; });

      const command: UpdateAchievementContentCommand = {
        key: '123ABC',
        // We don't care about the other properties
      }

      const response = await commandHandler.execute(command) as HandlerResponse;

      expect(response).toBeDefined();
      expect(response.data).toBeUndefined();
      expect(response.input).toBe(command);
      expect(response.error).toBeInstanceOf(EntityNotFoundException);
      expect(errorPolicy.handleError).toBeCalled();
    });


    // TEST: When a null command is provided
    // TEST: Then the command handler will return a response with the invalid command error
    it('Should return response with an invalid command error when the command is not provided', async () => {

      jest.spyOn(achievementRepository, 'getAchievementEntity').mockImplementation(async (key) => { return null; });
      jest.spyOn(achievementRepository, 'saveAchievementEntity').mockImplementation(async (entity) => { return null; });
      jest.spyOn(achievementRepository, 'saveAchievementDto').mockImplementation(async (entity) => { return null; });

      const response = await commandHandler.execute(null) as HandlerResponse;

      expect(response).toBeDefined();
      expect(response.data).toBeUndefined();
      expect(response.input).toBeNull();
      expect(response.error).toBeInstanceOf(InvalidCommandException);
      expect(errorPolicy.handleError).toBeCalled();
    });

    
    // TEST: When a valid command is provided and the entity search throws an error
    // TEST: Then the command handler will return aresponse with the unhandled error
    it('Should return response with an error when the entity retrieval fails', async () => {

      jest.spyOn(achievementRepository, 'getAchievementEntity').mockRejectedValue(new ReferenceError("Generic reference error"));
      jest.spyOn(achievementRepository, 'saveAchievementEntity').mockImplementation(async (entity) => { return entity; });
      jest.spyOn(achievementRepository, 'saveAchievementDto').mockImplementation(async (entity) => { return entity; });

      const command: UpdateAchievementContentCommand = {
        key: '123ABC',
        // We don't care about the other properties
      }

      const response = await commandHandler.execute(command) as HandlerResponse;

      expect(response).toBeDefined();
      expect(response.data).toBeUndefined();
      expect(response.input).toBe(command);
      expect(response.error).toBeInstanceOf(ReferenceError);
      expect(errorPolicy.handleError).toBeCalled();
    });


    // TEST: When a valid command is provided and the entity save throws an error
    // TEST: Then the command handler will return aresponse with the unhandled error
    it('Should return response with an error when the entity save fails', async () => {

      jest.spyOn(achievementRepository, 'getAchievementEntity').mockImplementation(async (key) => { return entity; });
      jest.spyOn(achievementRepository, 'saveAchievementEntity').mockRejectedValue(new ReferenceError("Generic reference error"));
      jest.spyOn(achievementRepository, 'saveAchievementDto').mockImplementation(async (entity) => { return entity; });

      const command: UpdateAchievementContentCommand = {
        key: '123ABC',
        // We don't care about the other properties
      }

      const response = await commandHandler.execute(command) as HandlerResponse;

      expect(response).toBeDefined();
      expect(response.data).toBeUndefined();
      expect(response.input).toBe(command);
      expect(response.error).toBeInstanceOf(ReferenceError);
    });

  });


  describe('mapToEntity', () => {

    beforeAll(() => {
      commandHandler = new UpdateAchievementContentCommandHandler(logPolicy, errorPolicy, null, achievementRepository, skillRepository)
    });

    it('Should throw not implemented exception', () => {

      expect(async () => { await commandHandler.mapToEntity(null) }).rejects.toThrow(NotImplementedException);
    });

  });


  describe('mergeToEntity', () => {

    beforeAll(() => {
      commandHandler = new UpdateAchievementContentCommandHandler(logPolicy, errorPolicy, null, null, skillRepository);

      entity = {
        key: '123ABC',
        title: 'entity title',
        description: 'entity description',
        completedDate: new Date('2012-01-01'),
        visibility: AchievementVisibility.Everyone,
        skills: [new Skill('str', '', ''), new Skill('dex', '', '')],
        media: null,
        timestamp: new Date(),
        userProfile: null
      };

    });

    // TEST: When providing a full command, and providing the key;
    // TEST: The merge will replace the properties that are present in the command
    it('Should merge full command into entity when the command is complete', async () => {

      const command: UpdateAchievementContentCommand = {
        key: '123ABC',
        title: 'command title',
        description: 'command description',
        completedDate: new Date('2012-01-02'),
        visibility: AchievementVisibility.Fiends,
        skills: ['int', 'wis']
      }

      let entity: Achievement = {
        key: '123ABC',
        title: 'entity title',
        description: 'entity description',
        completedDate: new Date('2012-01-01'),
        visibility: AchievementVisibility.Everyone,
        skills: [new Skill('str', '', ''), new Skill('dex', '', '')],
        media: null,
        timestamp: new Date(),
        userProfile: null
      };

      const mergedEntity = await commandHandler.mergeToEntity(command, entity) as Achievement;

      expect(mergedEntity.title).toBe(command.title);
      expect(mergedEntity.description).toBe(command.description);
      expect(mergedEntity.completedDate).toBe(command.completedDate);
      expect(mergedEntity.visibility).toBe(command.visibility);


      const mskills = mergedEntity.skills.map((item) => { return item.key }).sort();
      const cskills = command.skills.sort();

      expect(mskills).toEqual(cskills);

    });

    // TEST: When providing a partial command, and providing the key;
    // TEST: The merge will ignore the missing command properties and only replace the properties that are present in the command
    it('Should merge partial command into entity when the command is partial', async () => {

      const command: UpdateAchievementContentCommand = {
        key: '123ABC',
        title: 'command title',
        description: 'command description',
      }

      const mergedEntity = await commandHandler.mergeToEntity(command, entity) as Achievement;

      expect(mergedEntity.title).toBe(command.title);
      expect(mergedEntity.description).toBe(command.description);
      expect(mergedEntity.completedDate).toBe(entity.completedDate);
      expect(mergedEntity.visibility).toBe(entity.visibility);


      const mskills = mergedEntity.skills.map((item) => { return item.key }).sort();
      const cskills = entity.skills.map((item) => { return item.key }).sort();

      expect(mskills).toEqual(cskills);

    });

    // TEST: When providing an empty command, and providing the key;
    // TEST: The merge will ignore the missing command properties and remain in the same state
    it('Should not merge empty command into entity when the command is empty', async () => {

      const command: UpdateAchievementContentCommand = {
        key: '123ABC',
      }

      const mergedEntity = await commandHandler.mergeToEntity(command, entity) as Achievement;

      expect(mergedEntity.title).toBe(entity.title);
      expect(mergedEntity.description).toBe(entity.description);
      expect(mergedEntity.completedDate).toBe(entity.completedDate);
      expect(mergedEntity.visibility).toBe(entity.visibility);

      const mskills = mergedEntity.skills.map((item) => { return item.key }).sort();
      const cskills = entity.skills.map((item) => { return item.key }).sort();

      expect(mskills).toEqual(cskills);

    });

    // TEST: When providing a command, and the entity is null;
    // TEST: The merge return null as the result
    it('Should not merge and return null when the entity is null', async () => {

      const command: UpdateAchievementContentCommand = {
        key: '123ABC',
        title: 'command title',
        description: 'command description',
      }

      const mergedEntity = await commandHandler.mergeToEntity(command, null) as Achievement;

      expect(mergedEntity).toBeNull();
    });

    // TEST: When providing a null command, and the entity is provided;
    // TEST: The merge return the entity unchanged as the result
    it('Should not merge and return entity when the command is null', async () => {

      const mergedEntity = await commandHandler.mergeToEntity(null, entity) as Achievement;

      expect(mergedEntity.title).toBe(entity.title);
      expect(mergedEntity.description).toBe(entity.description);
      expect(mergedEntity.completedDate).toBe(entity.completedDate);
      expect(mergedEntity.visibility).toBe(entity.visibility);

      const mskills = mergedEntity.skills.map((item) => { return item.key }).sort();
      const cskills = entity.skills.map((item) => { return item.key }).sort();

      expect(mskills).toEqual(cskills);
    });

  });

});
