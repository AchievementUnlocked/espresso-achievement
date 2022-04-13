import { AchievementSkillsUpdatedEvent } from './achievement-skills-updated.event';

describe('AchievementSkillsUpdatedEvent', () => {
  it('should be defined', () => {
    expect(new AchievementSkillsUpdatedEvent(null, null, null)).toBeDefined();
  });
});
