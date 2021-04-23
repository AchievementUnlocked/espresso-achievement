import { SkillFullDto } from './skill-full.schema';

describe('SkillFullSchema', () => {
  it('should be defined', () => {
    expect(new SkillFullDto()).toBeDefined();
  });
});
