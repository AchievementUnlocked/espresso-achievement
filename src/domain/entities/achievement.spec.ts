import { Achievement } from '.';

describe('Achievement', () => {
  it('should be defined', () => {
    const id = '12345678-abcd-abcd-1234-0123456789abc';

    expect(new Achievement(id)).toBeDefined();
  });
});
