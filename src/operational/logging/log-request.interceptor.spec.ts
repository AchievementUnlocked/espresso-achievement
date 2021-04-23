import { LogRequestInterceptor } from './log-request.interceptor';

import { ConfigPolicyService } from '../configuration';
import { LogPolicyService } from '../logging';

describe('LogRequestInterceptor', () => {
  it('should be defined', () => {
    const configPolicy = new ConfigPolicyService();
    const logPolicy = new LogPolicyService(configPolicy);

    expect(new LogRequestInterceptor(logPolicy)).toBeDefined();
  });
});
