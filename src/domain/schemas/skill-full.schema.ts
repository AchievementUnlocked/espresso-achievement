import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { Skill } from 'domain/entities';

export type SkillFullDocument = SkillFullDto & Document;

@Schema({ collection: 'SkillFull' })
export class SkillFullDto {

    @Prop()
    key: string;

    @Prop()
    name: string;

    @Prop()
    abreviation: string;

    static fromDomain(entity: Skill): SkillFullDto {
        const dto = new SkillFullDto();

        dto.key = entity.key;
        dto.name = entity.name;
        dto.abreviation = entity.abreviation;

        return dto;
    }

    static toDomain(dto: SkillFullDto): Skill {
        const entity = new Skill(
            dto.key,
            dto.name,
            dto.abreviation
        );

        return entity;
    }

    /*
    static fromCreateCommand(command: CreateSkillCommand): SkillFullDto {
        const dto = new SkillFullDto();

        dto.name = command.name;
        dto.abreviation = command.abreviation;

        return dto;
    }
    */
}

export const SkillFullSchema = SchemaFactory.createForClass(SkillFullDto);
