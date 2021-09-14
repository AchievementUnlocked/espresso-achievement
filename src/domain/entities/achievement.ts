import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Entity, Aggregate, Skill, AchievementVisibility, AchievementMedia, UserProfile } from 'domain/entities';

export type AchievementDocument = Achievement & Entity & Document;

@Schema({ collection: 'Achievement' })
export class Achievement extends Entity {

    @Prop()
    key: string;

    @Prop()
    timestamp: Date;
    
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    completedDate: Date;

    @Prop([Skill])
    skills: Skill[];

    @Prop()
    visibility: AchievementVisibility;

    @Prop([AchievementMedia])
    media: AchievementMedia[];

    //@Prop({ type: typeof UserProfile})
    @Prop()
    userProfile: UserProfile;

    constructor(key: string) {
        super(key);
    }
}

export const AchievementSchema = SchemaFactory
    .createForClass(Achievement)
    .index({ key: 1 }, { unique: true });