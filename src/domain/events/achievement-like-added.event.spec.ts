import { AchievementLikeAddedEvent } from './achievement-like-added.event';

describe('AchievementLikeAddedEvent', () => {
  it('should be defined', () => {
    expect(new AchievementLikeAddedEvent()).toBeDefined();
  });
});
