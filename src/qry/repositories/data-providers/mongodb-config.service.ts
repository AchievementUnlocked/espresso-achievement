import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { ConfigPolicyService } from 'operational/configuration';

@Injectable()
export class MongodbConfigService implements MongooseOptionsFactory {
  readonly mongoDbConnectionString: string;

  constructor(private readonly configPolicy: ConfigPolicyService) {
    this.mongoDbConnectionString = this.configPolicy.get(
      'MONGO_CONNECTION_STRING',
    );
  }

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.mongoDbConnectionString
    };
  }
}
