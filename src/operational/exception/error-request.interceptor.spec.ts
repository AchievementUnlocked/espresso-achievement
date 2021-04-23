import { ConfigPolicyService } from '../configuration';
import { LogPolicyService } from '../logging';

import { ErrorRequestInterceptor, ErrorPolicyService } from '.';

describe('ErrorRequestInterceptor', () => {
  it('should be defined', () => {

    const configPolicy = new ConfigPolicyService();
    const logPolicy = new LogPolicyService(configPolicy);
    const errorPolicy = new ErrorPolicyService(logPolicy);

    expect(new ErrorRequestInterceptor(errorPolicy)).toBeDefined();
  });
});
