import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Entity } from '../entities';

export type UserProfileDocument = UserProfile & Entity & Document;

@Schema({ collection: 'UserProfile' })
export class UserProfile extends Entity {

    @Prop()
    key: string;

    @Prop()
    timestamp: Date;
    
    @Prop()
    userName: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    email: string;

    constructor(id: string) {
        super(id);
    }
}

export const UserProfileSchema = SchemaFactory
    .createForClass(UserProfile)
    .index({ userName: 1 }, { unique: true });