import moment from 'moment';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Entity, UserProfile } from 'domain/entities';

export type LikeActionDocument = LikeAction & Document;

@Schema({ collection: 'LikeAction' })
export class LikeAction extends Entity {

    @Prop()
    achievementKey: string;

    @Prop()
    likeCount: number;

    @Prop()
    userProfile: UserProfile;

    //@Prop()
    //timestamp: Date

    constructor(achievementKey?: string, userProfile?: UserProfile, likeCount?: number) {
        super(null);

        this.achievementKey = achievementKey;
        this.userProfile = userProfile;
        this.likeCount = likeCount;
        this.timestamp = moment().utc().toDate();
    }
}


export const LikeActionSchema = SchemaFactory
    .createForClass(LikeAction)
    .index({ achievementKey: 1 }, { unique: false });