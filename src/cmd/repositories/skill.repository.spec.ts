import { Test, TestingModule } from '@nestjs/testing';
import { SkillRepository } from './skill.repository';

describe('SkillRepository', () => {
  let provider: SkillRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillRepository],
    }).compile();

    provider = module.get<SkillRepository>(SkillRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
