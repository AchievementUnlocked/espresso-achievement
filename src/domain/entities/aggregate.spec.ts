import { Aggregate } from '.';

describe('Aggregate', () => {
  it('should be defined', () => {
    const id = '12345678-abcd-abcd-1234-0123456789abc';
    expect(new Aggregate(id)).toBeDefined();

  });
});
