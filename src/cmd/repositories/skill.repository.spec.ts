import { Test, TestingModule } from '@nestjs/testing';
import { Skill } from '../../domain/entities';

import { ConfigPolicyService } from '../../operational/configuration';
import { LogPolicyService } from '../../operational/logging';
import { SkillCacheProvider, SkillMongoDbProvider } from './data-providers';


import { SkillRepository } from './skill.repository';

describe('SkillRepository', () => {

  let configPolicy: ConfigPolicyService;
  let logPolicy: LogPolicyService;
  let cacheProvider: SkillCacheProvider;
  let mongoDbProvider: SkillMongoDbProvider;
  let repository: SkillRepository;


  beforeAll(() => {

    configPolicy = new ConfigPolicyService(null);
    jest.spyOn(configPolicy, 'get').mockImplementation((key) => '1');

    logPolicy = new LogPolicyService(configPolicy);
    jest.spyOn(logPolicy, 'trace').mockImplementation((msg, ctx) => { });

    cacheProvider = new SkillCacheProvider(logPolicy, null);
    jest.spyOn(cacheProvider, 'getSkills').mockImplementation(async (callback) => {

      let skills = new Array<Skill>();

      skills.push(
        new Skill('str', 'strength', 'str'),
        new Skill('dex', 'dexterity', 'dex'),
        new Skill('con', 'constitution', 'con')
      );

      return skills;
    });

    mongoDbProvider = new SkillMongoDbProvider(logPolicy, null);
    jest.spyOn(mongoDbProvider, 'getSkills').mockImplementation(async () => {

      return [];

    });

    repository = new SkillRepository(logPolicy, cacheProvider, mongoDbProvider);
  });


  describe('Constructoir', () => {

    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

  });


  describe('getSkills', () => {

    // TEST: When getSkills is called
    // TEST: Then it should return a list of skills
    it('Should return a user profile when an existing user name is given', async () => {

      const response = await repository.getSkills() as Skill[];

      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
    });








  });



});
