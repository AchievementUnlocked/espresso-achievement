import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import { LogPolicyService } from '../logging';

import { ErrorPolicyService } from './error-policy.service';

@Catch(HttpException)
export class AppExceptionFilter<T> implements ExceptionFilter {

  constructor(
    private readonly logPolicy: LogPolicyService,
    private readonly errorPolicy: ErrorPolicyService) {
    this.logPolicy.trace('Init AppExceptionFilter', 'Init');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logPolicy.trace('Call AppExceptionFilter:Catch', 'Call');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    // Handle and log the exception using the error policy configured for the running environment
    const handledError = this.errorPolicy.handleError(exception);

    response
      .status(handledError.getStatus())
      .json({
        message: handledError.message,
        details: handledError.details,
      });
  }
}
