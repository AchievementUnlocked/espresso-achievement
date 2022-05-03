import { Achievement } from 'domain/entities';
import { AchievementCreatedEvent } from './achievement-created.event';

describe('AchievementCreatedEvent', () => {
  it('should be defined', () => {
    const entity = new Achievement('123abc');
    expect(new AchievementCreatedEvent(entity)).toBeDefined();
  });
});
