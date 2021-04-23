import { ConfigPolicyService } from '../configuration';
import { LogPolicyService } from '../logging';

import { AppExceptionFilter, ErrorPolicyService } from '.';

describe('AppExceptionFilter', () => {
  it('should be defined', () => {

    const configPolicy = new ConfigPolicyService();
    const logPolicy = new LogPolicyService(configPolicy);
    const errorPolicy = new ErrorPolicyService(logPolicy);

    expect(new AppExceptionFilter(logPolicy, errorPolicy)).toBeDefined();
  });
});
