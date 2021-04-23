import { AppException, AppExceptionReason } from '.';

describe('AppException', () => {
  it('should be defined', () => {

    const message = 'error message';
    const reason = AppExceptionReason.Unknown;

    expect(new AppException(message, reason)).toBeDefined();
  });
});
