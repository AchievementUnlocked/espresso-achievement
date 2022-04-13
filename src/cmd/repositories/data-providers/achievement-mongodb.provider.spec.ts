import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { OperationalConfigModule, ConfigPolicyService } from '../../../operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from '../../../operational/logging';

import { Achievement, AchievementDocument, AchievementMedia, AchievementVisibility, Skill, UserProfile } from '../../../domain/entities';
import { AchievementFullDocument, AchievementFullDto } from '../../../domain/schemas';

import { AchievementMongoDBProvider } from '.';

describe('Achievement Mongo DB Provider', () => {
  let configPolicy: ConfigPolicyService;
  let logPolicy: LogPolicyService;
  let achievementEntityModel: Model<AchievementDocument>;
  let achievementDtoModel: Model<AchievementFullDocument>
  let provider: AchievementMongoDBProvider;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        OperationalConfigModule,
        OperationalLoggingModule
      ],
      providers: [
        { provide: ConfigPolicyService, useValue: configPolicy, },
        { provide: LogPolicyService, useValue: logPolicy, },
        { provide: getModelToken(Achievement.name), useValue: Model },
        { provide: getModelToken(AchievementFullDto.name), useValue: Model },
        AchievementMongoDBProvider
      ],
    }).compile();

    configPolicy = new ConfigPolicyService(null);
    jest.spyOn(configPolicy, 'get').mockImplementation((_key) => '1');

    logPolicy = new LogPolicyService(configPolicy);
    jest.spyOn(logPolicy, 'trace').mockImplementation((_msg, _ctx) => { });

    achievementEntityModel = module.get<Model<AchievementDocument>>(getModelToken(Achievement.name));
    achievementDtoModel = module.get<Model<AchievementFullDocument>>(getModelToken(AchievementFullDto.name));
    provider = module.get<AchievementMongoDBProvider>(AchievementMongoDBProvider);
  });


  describe('Constructor', () => {
    it('Should be defined', () => {
      expect(provider).toBeDefined();
    });

  });


  describe('getAchievementEntity', () => {

    it('Should return an achievment when the key is provided', async () => {

      const key = '123ABC';

      achievementEntityModel.findOne = jest.fn().mockImplementationOnce(
        () => ({
          exec: jest.fn().mockResolvedValueOnce(new Achievement(key))
        }));

      const response = await provider.getAchievementEntity(key) as Achievement;;

      expect(response).toBeDefined();
      expect(response.key).toBe(key);
      expect(achievementEntityModel.findOne).toBeCalled();
    });

  });


  describe('saveAchievementEntity', () => {

    it('Should save an achievment when the entity is provided', async () => {

      const user: UserProfile = {
        key: '123ABC',
        userName: 'testUser', firstName: 'Test', lastName: 'User',
        email: 'test@email.com',
        timestamp: new Date()
      };

      const media: AchievementMedia = {
        key: '123MDA',
        timestamp: new Date(),
        mediaPath: '123ABC/123MDA.jpg',
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
        userProfile: user,
        createdBy: '',
        updatedBy: ''
      };

      achievementEntityModel.findOneAndUpdate = jest.fn().mockResolvedValueOnce(entity);
        
      const response = await provider.saveAchievementEntity(entity) as Achievement;;

      expect(response).toBeDefined();
      expect(response.key).toBe(entity.key);
      expect(achievementEntityModel.findOneAndUpdate).toBeCalled();
    });

  });



  describe('saveAchievementDto', () => {

    it('Should save an achievment when the dto is provided', async () => {

      const user: UserProfile = {
        key: '123ABC',
        userName: 'testUser', firstName: 'Test', lastName: 'User',
        email: 'test@email.com',
        timestamp: new Date()
      };

      const media: AchievementMedia = {
        key: '123MDA',
        timestamp: new Date(),
        mediaPath: '123ABC/123MDA.jpg',
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
        userProfile: user,
        createdBy: '',
        updatedBy: ''
      };

      const dto = AchievementFullDto.fromDomain(entity);

      achievementDtoModel.findOneAndUpdate = jest.fn().mockResolvedValueOnce(dto);
        
      const response = await provider.saveAchievementEntity(entity) as AchievementFullDto;;

      expect(response).toBeDefined();
      expect(response.key).toBe(dto.key);
      expect(achievementDtoModel.findOneAndUpdate).toBeCalled();
    });

  });

});
