import { AuError } from './au-error';

describe('AuError', () => {
  it('should be defined', () => {
    expect(new AuError()).toBeDefined();
  });
});
