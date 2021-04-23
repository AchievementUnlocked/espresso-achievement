import { Test, TestingModule } from '@nestjs/testing';

import { ConsoleLogProvider } from '.';

describe('ConsoleLogProvider', () => {
  let provider: ConsoleLogProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsoleLogProvider],
    }).compile();

    provider = module.get<ConsoleLogProvider>(ConsoleLogProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
