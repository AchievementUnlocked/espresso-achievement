import { InvalidEntityException } from './invalid-entity-exception';

describe('InvalidEntityException', () => {
  it('should be defined', () => {
    expect(new InvalidEntityException()).toBeDefined();
  });
});
