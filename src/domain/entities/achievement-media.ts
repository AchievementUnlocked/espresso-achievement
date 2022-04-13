import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Entity } from '../entities';

import { CodeGeneratorUtil, MimeTypeUtil } from 'domain/utils';

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

    constructor(key: string = null) {
        super(key);
    }


    public static build(originalName: string, mimeType: string, buffer: Buffer) {

        const entity = new AchievementMedia(CodeGeneratorUtil.GenerateShortCode());

        entity.originalName = originalName;
        entity.mimeType = mimeType;
        entity.buffer = buffer;
        entity.size = buffer.length;

        const extension = MimeTypeUtil.getExtension(mimeType);
        entity.mediaPath = `${entity.key}.${extension}`;

        return entity;
    }

    clearBuffer(): void {
        this.buffer = null;
    }
}

export const AchievementMediaSchema = SchemaFactory
    .createForClass(AchievementMedia)
    .index({ key: 1 }, { unique: true });
