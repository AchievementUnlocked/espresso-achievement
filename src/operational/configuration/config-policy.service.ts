import { Injectable } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ConfigService } from '@nestjs/config';

import { validate, registerSchema } from 'class-validator';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { Constants, ConfigValidationSchema } from '.';

@Injectable()
export class ConfigPolicyService {
    // private readonly envPath;
    private readonly envConfig: { [key: string]: string };

    constructor(private configService: ConfigService) {
        // this.envConfig = dotenv.parse(fs.readFileSync(Constants.ENV_FILE_PATH));

        console.log('Init ConfigPolicyService : ' + this.get('DUMMY'), 'Init');
    }

    /**
     * Gets a confoguration value by its key
     * @param {string} key
     * @returns {string}
     * @memberof ConfigPolicyService
     */
    get(key: string): string {
        // return this.envConfig[key];
        return this.configService.get<string>(key);
    }

    /**
     * Validates the configuration file with a base schema.
     * If the configuration fails it will throw an error;
     * otherwise, the configuration is validated successfully
     * @private
     * @memberof ConfigPolicyService
     */
    private validateConfigSchema() {
        /*
                registerSchema(ConfigValidationSchema.schema);

                const options: ValidatorOptions = {
                    skipMissingProperties: true,
                };

                validate(Constants.CONFIG_SCHEMA_NAME, this.envConfig, options)
                .then(errors => {

                    const errorObj = {
                        message: 'Configuration Schema Is Invalid',
                        details: errors,
                    };

                    // throw new Error(JSON.stringify(errorObj, null, 2));
                    console.error(JSON.stringify(errorObj, null, 2));
                })
                .catch(error => {
                    const errorObj = {
                        message: 'Configuration Schema Vallidator Failed',
                        details: error,
                    };

                    // throw new Error(JSON.stringify(errorObj, null, 2));
                    console.error(JSON.stringify(errorObj, null, 2));
                });
        */
    }
}
