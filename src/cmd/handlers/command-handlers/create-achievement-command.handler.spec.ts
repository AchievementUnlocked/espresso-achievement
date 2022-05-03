import { ConfigService } from '@nestjs/config';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NotImplementedException } from '@nestjs/common';

import { ConfigPolicyService } from '../../../operational/configuration';
import { ErrorPolicyService, EntityNotFoundException, InvalidCommandException, AppException, AppExceptionReason } from '../../../operational/exception';
import { LogPolicyService } from '../../../operational/logging';

import { Achievement, AchievementMedia, AchievementMediaSchema, AchievementVisibility, Skill, UserProfile } from '../../../domain/entities';
import { CreateAchievementCommand, CreateAchievementMediaCommand, UpdateAchievementContentCommand } from '../../../domain/commands';

import { CodeGeneratorUtil, MimeTypeUtil } from '../../../domain/utils';

import { AchievementRepository, UserProfileRepository, SkillRepository } from '../../../cmd/repositories';

import { HandlerResponse } from '../../../cmd/handlers';

import { CreateAchievementCommandHandler } from './create-achievement-command.handler';
import { exponentialRetryPolicy } from '@azure/core-http';



describe('Create Achievement Command Handler', () => {

  let eventBus: EventBus;
  let configPolicy: ConfigPolicyService;
  let logPolicy: LogPolicyService;
  let errorPolicy: ErrorPolicyService;
  let achievementRepository: AchievementRepository;
  let userProfileRepository: UserProfileRepository;
  let skillRepository: SkillRepository;

  let commandHandler: CreateAchievementCommandHandler;

  let entity: Achievement;

  beforeAll(() => {
    configPolicy = new ConfigPolicyService(null);
    jest.spyOn(configPolicy, 'get').mockImplementation((key) => '1');

    logPolicy = new LogPolicyService(configPolicy);
    jest.spyOn(logPolicy, 'trace').mockImplementation((msg, ctx) => { });

    errorPolicy = new ErrorPolicyService(logPolicy);
    jest.spyOn(errorPolicy, 'handleError').mockImplementation((err) => { return new AppException('', AppExceptionReason.Unknown, null) });

    userProfileRepository = new UserProfileRepository(logPolicy, null);
    jest.spyOn(userProfileRepository, 'getUserProfile').mockImplementation(
      async (usr) => {

        if (usr === 'testUser') {
          const userProfile: UserProfile = {
            key: '123ABC',
            userName: 'testUser', firstName: 'Test', lastName: 'User',
            email: 'test@email.com',
            timestamp: new Date()
          };
  
          return userProfile;
        }
        else if (usr !== 'testUser')
          return null;
        else
          throw new ReferenceError('Reference error')
      });

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

      expect(new CreateAchievementCommandHandler(logPolicy, errorPolicy, null, null, null, null)).toBeDefined();
    });

  });


  describe('execute', () => {


    beforeAll(() => {

      commandHandler = new CreateAchievementCommandHandler(logPolicy, errorPolicy, null, achievementRepository, userProfileRepository, skillRepository);

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



    // TEST: When a valid command is provided
    // TEST: Then the command handler will map the command to an entity, save it and return the entity
    it('Should execute command handler when a valid command is provided', async () => {

      jest.spyOn(achievementRepository, 'saveAchievementEntity').mockImplementation(async (entity) => { return entity; });
      jest.spyOn(achievementRepository, 'saveAchievementDto').mockImplementation(async (entity) => { return entity; });

      const mediaCommand: CreateAchievementMediaCommand = {
        buffer: Buffer.from('Buffer String'),
        mimeType: 'image/jpeg',
        originalName: 'media.jpg',
        size: 256
      };

      const command: CreateAchievementCommand = {
        title: 'command title',
        description: 'command description',
        completedDate: new Date('2012-01-02'),
        visibility: 1,
        skills: ['int', 'wis'],
        media: [mediaCommand],
        userName: 'testUser'
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


    // TEST: When a valid command is provided and the user belonging is not found
    // TEST: Then the command handler will return aresponse with the entity not found error
    it('Should return response with an entity not found error when the user is not found', async () => {

      jest.spyOn(achievementRepository, 'saveAchievementEntity').mockImplementation(async (entity) => { return entity; });
      jest.spyOn(achievementRepository, 'saveAchievementDto').mockImplementation(async (entity) => { return entity; });

      const command: CreateAchievementCommand = {
        title: 'command title',
        description: 'command description',
        completedDate: new Date('2012-01-02'),
        userName: 'notTestUser'
      }

      const response = await commandHandler.execute(command) as HandlerResponse;

      expect(response).toBeDefined();
      expect(response.data).toBeUndefined();
      expect(response.input).toBe(command);
      expect(response.error).toBeInstanceOf(EntityNotFoundException);

    });


    // TEST: When a null command is provided
    // TEST: Then the command handler will return a response with the invalid command error
    it('Should return response with an invalid command error when the command is not provided', async () => {
      
      jest.spyOn(achievementRepository, 'saveAchievementEntity').mockImplementation(async (entity) => { return null; });
      jest.spyOn(achievementRepository, 'saveAchievementDto').mockImplementation(async (entity) => { return null; });

      const response = await commandHandler.execute(null) as HandlerResponse;

      expect(response).toBeDefined();
      expect(response.data).toBeUndefined();
      expect(response.input).toBeNull();
      expect(response.error).toBeInstanceOf(InvalidCommandException);
      expect(errorPolicy.handleError).toBeCalled();
    });


    // TEST: When a valid command is provided and the entity save throws an error
    // TEST: Then the command handler will return aresponse with the unhandled error
    it('Should return response with an error when the entity save fails', async () => {

      jest.spyOn(achievementRepository, 'saveAchievementEntity').mockRejectedValue(new ReferenceError("Generic reference error"));
      jest.spyOn(achievementRepository, 'saveAchievementDto').mockImplementation(async (entity) => { return entity; });

      const command: CreateAchievementCommand = {
        title: 'command title',
        description: 'command description',
        completedDate: new Date('2012-01-02'),
        userName: 'testUser'
      }

      const response = await commandHandler.execute(command) as HandlerResponse;

      expect(response).toBeDefined();
      expect(response.data).toBeUndefined();
      expect(response.input).toBe(command);
      expect(response.error).toBeInstanceOf(ReferenceError);
    });




  });


  describe('mergeToEntity', () => {

    beforeAll(() => {
      commandHandler = new CreateAchievementCommandHandler(logPolicy, errorPolicy, null, null, null, null)
    });

    it('Should throw not implemented exception', () => {

      expect(async () => { await commandHandler.mergeToEntity(null, null) }).rejects.toThrow(NotImplementedException);
    });

  });


  describe('mapToEntity', () => {

    beforeAll(() => {
      commandHandler = new CreateAchievementCommandHandler(logPolicy, errorPolicy, null, achievementRepository, userProfileRepository, skillRepository);

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


    // TEST: When a full command is provided,and the username exists
    // TEST: Then the mapping should create a enw entity from the command, aqcuiring skills and user profile
    it('Should map full command into entity when the command is complete', async () => {

      const mediaCommand: CreateAchievementMediaCommand = {
        buffer: Buffer.from('Buffer String'),
        mimeType: 'image/jpeg',
        originalName: 'media.jpg',
        size: 256
      };

      const command: CreateAchievementCommand = {
        title: 'command title',
        description: 'command description',
        completedDate: new Date('2012-01-02'),
        visibility: 1,
        skills: ['int', 'wis'],
        media: [mediaCommand],
        userName: 'testUser'
      }

      const mappedEntity = await commandHandler.mapToEntity(command) as Achievement;

      expect(mappedEntity.key).toBeDefined();
      expect(mappedEntity.description).toBe(command.description);
      expect(mappedEntity.completedDate).toBe(command.completedDate);
      expect(mappedEntity.visibility).toBe(command.visibility);

      expect(skillRepository.getSkills).toBeCalled();
      expect(userProfileRepository.getUserProfile).toBeCalled();

      const mskills = mappedEntity.skills.map((item) => { return item.key }).sort();
      const cskills = command.skills.sort();

      expect(mskills).toEqual(cskills);

      expect(mappedEntity.media).toBeDefined();
      expect(mappedEntity.media.length).toBe(1);
      expect(mappedEntity.media[0].mediaPath).toContain(`${mappedEntity.key}/${mappedEntity.media[0].key}`);

      expect(mappedEntity.userProfile).toBeDefined();
      expect(mappedEntity.userProfile.firstName).toBe('Test');
      expect(mappedEntity.userProfile.lastName).toBe('User');
      expect(mappedEntity.userProfile.email).toBe('test@email.com');


    });

    // TEST: When a partial command is provided,and the username exists
    // TEST: Then the mapping should create a enw entity from the command, defaulting missing values and aqcuiring skills and user profile
    it('Should map partial command into entity when the command is complete', async () => {

      const command: CreateAchievementCommand = {
        title: 'command title',
        description: 'command description',
        completedDate: new Date('2012-01-02'),
        userName: 'testUser'
      }

      const mappedEntity = await commandHandler.mapToEntity(command) as Achievement;

      expect(mappedEntity.title).toBe(command.title);
      expect(mappedEntity.description).toBe(command.description);
      expect(mappedEntity.completedDate).toBe(command.completedDate);
      expect(mappedEntity.visibility).toBe(AchievementVisibility.Private); // Default value
      expect(mappedEntity.skills).toStrictEqual([]);
      expect(mappedEntity.media).toStrictEqual([]);

      expect(userProfileRepository.getUserProfile).toBeCalled();

      expect(mappedEntity.userProfile).toBeDefined();
      expect(mappedEntity.userProfile.firstName).toBe('Test');
      expect(mappedEntity.userProfile.lastName).toBe('User');
      expect(mappedEntity.userProfile.email).toBe('test@email.com');

    });

    // TEST: When a full command is provided,and the username does not exist
    // TEST: Then the mapping should return a entity not found exception
    it('Should throw entity not found exception when user is not found', async () => {

      const mediaCommand: CreateAchievementMediaCommand = {
        buffer: Buffer.from('Buffer String'),
        mimeType: 'image/jpeg',
        originalName: 'media.jpg',
        size: 256
      };

      const command: CreateAchievementCommand = {
        title: 'command title',
        description: 'command description',
        completedDate: new Date('2012-01-02'),
        visibility: 1,
        skills: ['int', 'wis'],
        media: [mediaCommand],
        userName: 'notTestUser'
      }

      expect(async () => await commandHandler.mapToEntity(command)).rejects.toThrow(EntityNotFoundException);

    });






  });

});

