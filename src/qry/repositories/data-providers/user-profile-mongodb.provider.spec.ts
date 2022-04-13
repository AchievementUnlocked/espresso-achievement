import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { OperationalConfigModule, ConfigPolicyService } from '../../../operational/configuration';
import { OperationalLoggingModule, LogPolicyService } from '../../../operational/logging';

import { UserProfile, UserProfileDocument } from '../../../domain/entities';

import { UserProfileMongoDBProvider } from '.';


describe('User Profile MongoDB Provider', () => {
  let configPolicy: ConfigPolicyService;
  let logPolicy: LogPolicyService;
  let mockUserModel: Model<UserProfileDocument>;
  let provider: UserProfileMongoDBProvider;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        OperationalConfigModule,
        OperationalLoggingModule
      ],
      providers: [
        { provide: ConfigPolicyService, useValue: configPolicy, },
        { provide: LogPolicyService, useValue: logPolicy, },
        { provide: getModelToken(UserProfile.name), useValue: Model },
        UserProfileMongoDBProvider
      ],
    }).compile();

    configPolicy = new ConfigPolicyService(null);
    jest.spyOn(configPolicy, 'get').mockImplementation((_key) => '1');

    logPolicy = new LogPolicyService(configPolicy);
    jest.spyOn(logPolicy, 'trace').mockImplementation((_msg, _ctx) => { });

    mockUserModel = module.get<Model<UserProfileDocument>>(getModelToken(UserProfile.name));
    provider = module.get<UserProfileMongoDBProvider>(UserProfileMongoDBProvider);

  });


  describe('Constructor', () => {

    it('Should be defined', () => {
      expect(provider).toBeDefined();
    });

  });


  describe('getUserProfile', () => {

    it('Should return a user profile when the user name is provided', async () => {

      const key = '123ABC';

      mockUserModel.findOne = jest.fn().mockImplementationOnce(
        () => ({
          exec: jest.fn().mockResolvedValueOnce(new UserProfile(key))
        }));

      const response = await provider.getUserProfile(key) as UserProfile;;

      expect(response).toBeDefined();
      expect(response.key).toBe(key);
      expect(mockUserModel.findOne).toBeCalled();
    });

  });

});
