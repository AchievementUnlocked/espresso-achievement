import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { LogPolicyService } from '.';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {

  constructor(private readonly logPolicy: LogPolicyService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();

    const requestTrace = {
      path: request.method + ' ' + request.path,
      headers: request.headers,
      query: request.query,
      body: request.body,
    };

    this.logPolicy.debug(requestTrace);

    return next.handle();
  }
}
