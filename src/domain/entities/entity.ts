import moment from 'moment';

export class Entity {

    rowId: string;
    key: string;
    timestamp: Date;

    constructor(key: string) {
        this.key = key;
        this.timestamp = moment().utc().toDate();
    }
}
