import moment = require('moment');

export class CodeGeneratorUtil {

    private static readonly multiplier = 1000000;
    private static readonly startDate = new Date(2020, 1, 1);
    private static readonly baseChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    static GenerateShortCode(): string {

        const seed = Math.floor(Math.random() * this.multiplier);
        const initialMilis = moment(this.startDate).utc().valueOf();
        const currentMilis = moment().utc().valueOf();

        const baseNum = this.baseChars.length;

        let div = 0;
        let mod = 0;
        let code = '';
        let timeCode = currentMilis - initialMilis + seed;

        while (timeCode > 0) {
            div = Math.floor(timeCode / baseNum);
            mod = timeCode % baseNum;

            code += this.baseChars.charAt(mod);
            timeCode = div;
        }

        return code;
    }
}
