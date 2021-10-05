import { InvalidCommandException } from './invalid-command-exception';

describe('InvalidCommandException', () => {
  it('should be defined', () => {
    expect(new InvalidCommandException()).toBeDefined();
  });
});
