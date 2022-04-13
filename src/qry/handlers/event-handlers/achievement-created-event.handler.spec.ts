import { AchievementCreatedEventHandler } from './achievement-created-event.handler';

describe('AchievementCreatedEventHandler', () => {
  it('should be defined', () => {
    expect(new AchievementCreatedEventHandler(null,null,null,null,null)).toBeDefined();
  });
});
