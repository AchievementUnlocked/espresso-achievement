import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import moment from 'moment';

export class Entity {

    _id: string;
   
    key: string;

    timestamp: Date;

    constructor(key: string) {
        this.key = key;
        this.timestamp = moment().utc().toDate();
    }
}