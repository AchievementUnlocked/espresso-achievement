import { Injectable, HttpException } from '@nestjs/common';

import { LogPolicyService } from '../logging';

import { AppException, AppExceptionReason, HttpErrorMessages } from '.';

@Injectable()
export class ErrorPolicyService {

    readonly logPolicy: LogPolicyService;

    constructor(private readonly logPolicyService: LogPolicyService) {
        this.logPolicy = logPolicyService;
    }

    handleError(error: Error): AppException {

        const handledError = error instanceof AppException
            ? error
            : this.buildAppException(error);

        this.logPolicy.error(handledError);

        return handledError;
    }

    private buildAppException(error: Error) {

        let appError: AppException;

        if (error instanceof HttpException) {
            appError = new AppException(
                HttpErrorMessages.Messages[error.getStatus().toString()] || HttpErrorMessages.Messages['500'],
                error.getStatus(),
                error);
        } else {
            appError = new AppException(
                HttpErrorMessages['500'],
                AppExceptionReason.Unknown,
                error);
        }

        return appError;
    }
}
