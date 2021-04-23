import { Achievement } from 'domain/entities';
import { CreateAchievementCompletedEvent } from './create-achievement-completed.event';

describe('CreateAchievementCompletedEvent', () => {
  it('should be defined', () => {
    const entity = new Achievement('123abc');
    expect(new CreateAchievementCompletedEvent(entity)).toBeDefined();
  });
});
