import moment from 'moment';

import { CodeGeneratorUtil } from 'domain/utils/code-gen-util';

export class CommonEvent {

readonly key: string;
readonly timestamp: Date;

    constructor() {
        this.key = CodeGeneratorUtil.GenerateShortCode();
        this.timestamp = moment().utc().toDate();
    }
}
