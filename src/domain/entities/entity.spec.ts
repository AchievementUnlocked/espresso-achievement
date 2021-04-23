import { Entity } from '.';

describe('Entity', () => {
  it('should be defined', () => {
    const id = '12345678-abcd-abcd-1234-0123456789abc';

    expect(new Entity(id)).toBeDefined();
  });
});
