import { Test, TestingModule } from '@nestjs/testing';
import { Achievement, AchievementMedia, AchievementVisibility, Skill, UserProfile } from '../../domain/entities';

import { ConfigPolicyService } from '../../operational/configuration';
import { LogPolicyService } from '../../operational/logging';
import { InvalidEntityException } from '../../operational/exception';


import { AchievementAzblobProvider, AchievementMongoDBProvider, SkillCacheProvider, SkillMongoDbProvider } from './data-providers';

import { AchievementFullDto } from '../../domain/schemas';

import { AchievementRepository } from '.';

describe('Achievement Repository', () => {

  let configPolicy: ConfigPolicyService;
  let logPolicy: LogPolicyService;
  let azureBlobProvider: AchievementAzblobProvider;
  let mongoDbProvider: AchievementMongoDBProvider;
  let repository: AchievementRepository;



  beforeAll(() => {

    configPolicy = new ConfigPolicyService(null);
    jest.spyOn(configPolicy, 'get').mockImplementation((key) => '1');

    logPolicy = new LogPolicyService(configPolicy);
    jest.spyOn(logPolicy, 'trace').mockImplementation((msg, ctx) => { });

    mongoDbProvider = new AchievementMongoDBProvider(logPolicy, null, null);
    jest.spyOn(mongoDbProvider, 'saveAchievementEntity').mockImplementation(async (entity) => { return entity; });
    jest.spyOn(mongoDbProvider, 'saveAchievementDto').mockImplementation(async (entity) => { return entity; });
    jest.spyOn(mongoDbProvider, 'getAchievementEntity').mockImplementation(async (key) => {
      return key.trim() ? new Achievement(key) : null;
    });

    azureBlobProvider = new AchievementAzblobProvider(configPolicy, logPolicy);
    jest.spyOn(azureBlobProvider, 'saveAchievementMediaDto').mockImplementation(async (entity) => { });

    repository = new AchievementRepository(logPolicy, mongoDbProvider, azureBlobProvider);
  });



  describe('Constructor', () => {

    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

  });



  describe('getAchievementEntity', () => {

    it('Should return an achievement when a valid key is provided', async () => {

      const response = await repository.getAchievementEntity('123ABC') as Achievement;

      expect(response).toBeDefined();
    });


    it('Should return null when a null or empty key is provided', async () => {

      const response = await repository.getAchievementEntity('') as Achievement;

      expect(response).toBeNull();
    });

  });


  describe('saveAchievementEntity', () => {

    it('Should save the entity and return it when a valid entitty is provided', async () => {

      const key = '123ABC';
      const response = await repository.getAchievementEntity(key) as Achievement;

      expect(response).toBeDefined();
      expect(response.key).toBe(key);
    });

  });



  describe('saveAchievementDto', () => {

    beforeAll(() => {
    });


    it('Should save the dto and return it when a valid entity is provided', async () => {

      const user: UserProfile = {
        key: '123USR',
        userName: 'testUser', firstName: 'Test', lastName: 'User',
        email: 'test@email.com',
        timestamp: new Date()
      };

      const media: AchievementMedia = {
        key: '123MDA',
        timestamp: new Date(),
        mediaPath: '123USR/123MDA.jpg',
        originalName: 'media.jpg',
        mimeType: 'image/jpeg',
        size: 256,
        buffer: Buffer.from('Buffer String'),
        encoding: '',
        clearBuffer: function (): void {
          this.buffer = null;
        }
      };

      const skills = [new Skill('str', '', ''), new Skill('dex', '', '')];

      const entity: Achievement = {
        key: '123ABC',
        timestamp: new Date(),
        title: 'achievement title',
        description: 'achievement description',
        completedDate: new Date(),
        skills: skills,
        visibility: AchievementVisibility.Fiends,
        media: [media],
        userProfile: user
      };

      const response = await repository.saveAchievementDto(entity) as AchievementFullDto;

      expect(response).toBeDefined();
      expect(response.key).toBe(entity.key);
      expect(azureBlobProvider.saveAchievementMediaDto).toBeCalled();
    });



    it('Should save the dto and return it when a valid entity is provided with no skills or media', async () => {

      const user: UserProfile = {
        key: '123USR',
        userName: 'testUser', firstName: 'Test', lastName: 'User',
        email: 'test@email.com',
        timestamp: new Date()
      };

      const entity: Achievement = {
        key: '123ABC',
        timestamp: new Date(),
        title: 'achievement title',
        description: 'achievement description',
        completedDate: new Date(),
        skills: null,
        visibility: AchievementVisibility.Fiends,
        media: null,
        userProfile: user
      };

      const response = await repository.saveAchievementDto(entity) as AchievementFullDto;

      expect(response).toBeDefined();
      expect(response.key).toBe(entity.key);
      expect(response.media).toStrictEqual([]);
      expect(response.skills).toStrictEqual([]);
    });


    it('Should throw an invalid entity exception when a null or undefined entity is provided', async () => {
      const entity = null;

      expect(async () => await repository.saveAchievementDto(entity)).rejects.toThrow(InvalidEntityException);
    });



    it('Should throw an invalid entity exception when a valid entity is provided and the user is missing', async () => {

      const media: AchievementMedia = {
        key: '123MDA',
        timestamp: new Date(),
        mediaPath: '123USR/123MDA.jpg',
        originalName: 'media.jpg',
        mimeType: 'image/jpeg',
        size: 256,
        buffer: Buffer.from('Buffer String'),
        encoding: '',
        clearBuffer: function (): void {
          this.buffer = null;
        }
      };

      const skills = [new Skill('str', '', ''), new Skill('dex', '', '')];

      const entity: Achievement = {
        key: '123ABC',
        timestamp: new Date(),
        title: 'achievement title',
        description: 'achievement description',
        completedDate: new Date(),
        skills: skills,
        visibility: AchievementVisibility.Fiends,
        media: [media],
        userProfile: null

      };

      expect(async () => await repository.saveAchievementDto(entity)).rejects.toThrow(InvalidEntityException);
    });

  });



});

