import { AppExceptionReason, AppException } from 'operational/exception';

import { ControlerErrors } from 'qry/controllers';

export class CommonController {

    handleError(error: Error, message?: string) {
        console.error(error);
        throw new AppException(
            message || ControlerErrors.UnknownApiError,
            AppExceptionReason.Unknown,
            error);
    }
}
