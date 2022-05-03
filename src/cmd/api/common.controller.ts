import { AppExceptionReason, AppException } from 'operational/exception';

import { ControlerErrors } from '.';

export class CommonController {

    handleError(error: Error, message?: string) {
        console.error(error);

        // TODO: [REFACTOR] Throw an HttpException from the controllers
        throw new AppException(
            message || ControlerErrors.UnknownApiError,
            AppExceptionReason.Unknown,
            error);
    }
}
