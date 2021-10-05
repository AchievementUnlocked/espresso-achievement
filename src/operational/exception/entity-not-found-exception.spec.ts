import { EntityNotFoundException } from './entity-not-found-exception';

describe('EntityNotFoundException', () => {
  it('should be defined', () => {
    expect(new EntityNotFoundException()).toBeDefined();
  });
});
