import { ValidationSchema } from 'class-validator';

import { Constants } from '.';

export class ConfigValidationSchema {

    static readonly schema: ValidationSchema = {
        name: Constants.CONFIG_SCHEMA_NAME,
        properties: {
            DUMMY: [{
                type: 'minLength', // validation type. All validation types are listed in ValidationTypes class.
                constraints: [2],
            }],
        },
    };

}
