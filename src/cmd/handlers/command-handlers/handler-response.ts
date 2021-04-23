export class HandlerResponse {

    isSuccess: boolean;
    count?: number;
    error?: Error;
    data?: any;
    input?: object;

    constructor(data?: any, error?: Error, input?: object) {

        this.isSuccess = data ? true : false;

        if (this.isSuccess) {
            this.data = data;
            this.count = data.length || null;
        } else {
            this.error = error;
            this.input = input;
        }
    }
}
