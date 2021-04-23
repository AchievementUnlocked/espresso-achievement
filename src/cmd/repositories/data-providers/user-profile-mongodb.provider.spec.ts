import { Test, TestingModule } from '@nestjs/testing';

import { UserProfileMongoDBProvider } from '.';

describe('UserProfileMongoDBProvider', () => {
  let provider: UserProfileMongoDBProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProfileMongoDBProvider],
    }).compile();

    provider = module.get<UserProfileMongoDBProvider>(UserProfileMongoDBProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
