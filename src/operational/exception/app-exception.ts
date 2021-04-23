import { HttpException } from '@nestjs/common';

import { AppExceptionReason } from '.';

export class AppException extends HttpException {

    readonly message: string;
    readonly details: string;
    readonly internalStack: string;

    constructor(message: string, reason: AppExceptionReason, internalError?: Error) {
        super(null, reason.valueOf());

        this.message = message;

        if (internalError) {
            this.internalStack = internalError instanceof HttpException
                ? internalError.toString()
                : internalError.stack;
            this.details = internalError instanceof HttpException
            ? internalError.message
            : null;
        }
    }
}
