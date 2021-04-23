import { UserProfile } from '.';

describe('UserProfile', () => {
  it('should be defined', () => {
    expect(new UserProfile('123abc')).toBeDefined();
  });
});
