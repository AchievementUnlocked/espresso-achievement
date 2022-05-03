import { Test, TestingModule } from '@nestjs/testing';

import { ConfigPolicyService } from '../../../operational/configuration';
import { LogPolicyService } from '../../../operational/logging';
import { InvalidEntityException } from '../../../operational/exception';

import { AchievementAzblobProvider } from '.';
import { AchievementMediaFullDto } from '../../../domain/schemas';


class AchievementAzblobProviderTest extends AchievementAzblobProvider
{
  constructor(
    configPolicy: ConfigPolicyService,
    logPolicy: LogPolicyService)
    {
      super(configPolicy, logPolicy);
    }

    override createBlockBlobClient(path: string): any {
      return super.createBlockBlobClient(path);
    }
}

describe('Achievement Az Blob Provider', () => {
  let configPolicy: ConfigPolicyService;
  let logPolicy: LogPolicyService;
  let provider: AchievementAzblobProvider;

  beforeAll(() => {

    configPolicy = new ConfigPolicyService(null);
    jest.spyOn(configPolicy, 'get').mockImplementation((key) => `${key}_Value`);

    logPolicy = new LogPolicyService(configPolicy);
    jest.spyOn(logPolicy, 'trace').mockImplementation((msg, ctx) => { });

    provider = new AchievementAzblobProvider(configPolicy, logPolicy);
  });


  describe('Constructor', () => {

    it('should be defined', () => {
      expect(provider).toBeDefined();
    });

  });


  describe('saveAchievementMediaDto', () => {



    it('Should save the dtowhen a valid dto is provided', () => {

      const dto: AchievementMediaFullDto[] = [];

      // async saveAchievementMediaDto(dto: AchievementMediaFullDto[]) {
      

    });


  });


});
