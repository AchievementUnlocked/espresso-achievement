import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import moment from 'moment';
import { CodeGeneratorUtil } from 'domain/utils';

export class Entity {

    _id?: string;
   
    @Prop()
    key: string;

    @Prop()
    timestamp: Date;

    constructor(key: string) {
        this.key = this.key = key || CodeGeneratorUtil.GenerateShortCode();
        this.timestamp = moment().utc().toDate();
    }
}