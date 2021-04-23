import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError  } from 'rxjs';

import { ErrorPolicyService } from '.';

@Injectable()
export class ErrorRequestInterceptor implements NestInterceptor {

  constructor(private readonly errorPolicy: ErrorPolicyService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}
