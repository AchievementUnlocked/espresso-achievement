import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Achievement } from 'domain/entities';
import { AchievementMediaFullDto } from './achevement-media-full.schema';
import { SkillFullDto } from './skill-full.schema';
import { UserProfileFullDto } from './userprofile-full.schema';

export type AchievementFullDocument = AchievementFullDto & Document;

@Schema({ collection: 'AchievementFull' })
export class AchievementFullDto {

    @Prop()
    key: string;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    completedDate: Date;

    @Prop([SkillFullDto])
    skills: SkillFullDto[];

    @Prop([AchievementMediaFullDto])
    media: AchievementMediaFullDto[];

    @Prop()
    visibility: number;

    @Prop()
    userProfile: UserProfileFullDto;


    static fromDomain(entity: Achievement): AchievementFullDto {

        const dto = new AchievementFullDto();

        dto.key = entity.key;
        dto.title = entity.title;
        dto.description = entity.description;
        dto.completedDate = entity.completedDate;
        dto.visibility = entity.visibility;

        dto.skills = entity.skills
            ? entity.skills.map((val, idx) => {
                return SkillFullDto.fromDomain(val);
            })
            : [];

        dto.media = entity.media
            ? entity.media.map((val, idx) => {
                return AchievementMediaFullDto.fromDomain(val);
            })
            : [];

        dto.userProfile = UserProfileFullDto.fromDomain(entity.userProfile);

        return dto;
    }


    /*
    static fromCreateCommand(command: CreateAchievementCommand): AchievementFullDto {

        const dto = new AchievementFullDto();

        dto.key = command.key;
        dto.title = command.title;
        dto.description = command.description;
        dto.completedDate = command.completedDate;
        dto.visibility = command.visibility;

        dto.skills = command.skills.map((val) => {
            return SkillFullDto.fromCreateCommand(val);
        });

        dto.media = command.media.map((val) => {
            return AchevementMediaFullDto.fromCreateCommand(val);
        });

        dto.userProfile = UserProfileFullDto.fromCreateCommand(command.userProfile);

        return dto;
    }
    */
}

export const AchievementFullSchema = SchemaFactory
    .createForClass(AchievementFullDto)
    .index({ key: 1 }, { unique: true });
