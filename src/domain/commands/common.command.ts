import moment from 'moment';

export class CommonCommand {
    readonly id?: string;

    readonly timestamp?: Date;

    commandingUser: string;

    constructor() {
        this.timestamp = moment().utc().toDate();
    }

    static castToCommand<T>(input: any): T {
        return input;
    }
}
