import { ConfigPolicyService } from '../../operational/configuration';
import { LogPolicyService } from '../../operational/logging';

import { UserProfile } from '../../domain/entities';

import { UserProfileMongoDBProvider } from './data-providers';


import { UserProfileRepository } from '.';

describe('UserProfileRepository', () => {

  let configPolicy: ConfigPolicyService;
  let logPolicy: LogPolicyService;
  let mongoDbProvider: UserProfileMongoDBProvider;
  let repository: UserProfileRepository;

  beforeAll(() => {

    configPolicy = new ConfigPolicyService(null);
    jest.spyOn(configPolicy, 'get').mockImplementation((key) => '1');

    logPolicy = new LogPolicyService(configPolicy);
    jest.spyOn(logPolicy, 'trace').mockImplementation((msg, ctx) => { });

    mongoDbProvider = new UserProfileMongoDBProvider(logPolicy, null);
    jest.spyOn(mongoDbProvider, 'getUserProfile').mockImplementation(async (usr) => {

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


    repository = new UserProfileRepository(logPolicy, mongoDbProvider);
  });




  describe('Constructor', () => {

    it('Should be defined', () => {
      expect(repository).toBeDefined();
    });

  });


  describe('getUserProfile', () => {



    // TEST: When an existing user name is given
    // TEST: Then the function should return the user profile that belongs to the user name
    it('Should return a user profile when an existing user name is given', async () => {


      const response = await repository.getUserProfile('testUser') as UserProfile;

      expect(response).toBeDefined();
      expect(response.key).toBe('123ABC');
      expect(response.firstName).toBe('Test');
      expect(response.lastName).toBe('User');
    });


    // TEST: When a non existing user name is given
    // TEST: Then the function should return null
    it('Should return null when a non eistent user name is given', async () => {

      const response = await repository.getUserProfile('nonTestUser') as UserProfile;

      expect(response).toBeNull();
    });


  });

});
