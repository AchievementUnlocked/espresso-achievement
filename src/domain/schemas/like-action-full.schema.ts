import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { UserProfileFullDto } from 'domain/schemas';

export type LikeActionFullDocument = LikeActionFullDto & Document;

@Schema({ collection: 'LikeActionFull' })
export class LikeActionFullDto {

    @Prop()
    likeCount: number;

    @Prop()
    userProfile: UserProfileFullDto;
}

export const LikeActionFullSchema = SchemaFactory.createForClass(LikeActionFullDto);

