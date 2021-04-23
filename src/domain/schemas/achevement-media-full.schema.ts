import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AchievementMedia } from 'domain/entities';

export type AchievementMediaFullDocument = AchievementMediaFullDto & Document;

@Schema({ collection: 'AchievementMediaFull' })
export class AchievementMediaFullDto {

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


    static fromDomain(entity: AchievementMedia): AchievementMediaFullDto {

        const dto = new AchievementMediaFullDto();

        dto.mediaPath = entity.mediaPath;
        dto.originalName = entity.originalName;
        dto.mimeType = entity.mimeType;
        dto.size = entity.size;
        dto.encoding = entity.encoding;
        dto.buffer = entity.buffer;

        return dto;
    }

}

export const AchevementMediaSchema = SchemaFactory
    .createForClass(AchievementMediaFullDto);
