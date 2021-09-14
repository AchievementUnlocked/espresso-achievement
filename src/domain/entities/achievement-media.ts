import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Entity } from '../entities';

export type AchievementMediaDocument = AchievementMedia & Entity & Document;

@Schema({ collection: 'AchievementMedia' })
export class AchievementMedia extends Entity {

    @Prop()
    key: string;

    @Prop()
    timestamp: Date;
    
    @Prop()
    mediaPath: string;

    @Prop()
    originalName: string;

    @Prop()
    mimeType: string;

    @Prop()
    size: number;

    @Prop()
    encoding: string;

    buffer: Buffer;

    constructor(key: string) {
        super(key);
    }

    clearBuffer(): void {
        this.buffer = null;
    }
}

export const AchievementMediaSchema = SchemaFactory
    .createForClass(AchievementMedia)
    .index({ key: 1 }, { unique: true });
