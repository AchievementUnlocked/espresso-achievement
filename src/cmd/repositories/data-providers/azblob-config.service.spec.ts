import { Test, TestingModule } from '@nestjs/testing';
import { AzblobConfigService } from './azblob-config.service';

describe('AzblobConfigService', () => {
  let service: AzblobConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzblobConfigService],
    }).compile();

    service = module.get<AzblobConfigService>(AzblobConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
