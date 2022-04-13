import { AchievementContentUpdatedEvent } from './achievement-content-updated.event';

describe('AchievementContentUpdatedEvent', () => {
  it('should be defined', () => {
    expect(new AchievementContentUpdatedEvent()).toBeDefined();
  });
});
