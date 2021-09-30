import { Injectable } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ConfigService } from '@nestjs/config';

import { validate, registerSchema } from 'class-validator';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { Constants, ConfigValidationSchema } from '.';

@Injectable()
export class ConfigPolicyService {

    constructor(private configService: ConfigService) {
        // console.log('Init ConfigPolicyService : Init');
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

}
