import { Skill } from '.';

describe('Skill', () => {
  it('should be defined', () => {
    const id = '12345678-abcd-abcd-1234-0123456789abc';
    const name = 'skill name';
    const abreviation = 'sabv';
    expect(new Skill(id, name, abreviation)).toBeDefined();
  });
});
