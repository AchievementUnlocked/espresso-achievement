import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Entity } from '../entities';

export type SkillDocument = Skill & Entity & Document;

@Schema({ collection: 'Skill' })

export class Skill extends Entity {

    @Prop()
    key: string;

    @Prop()
    timestamp: Date;
    
    @Prop()
    name: string;

    @Prop()
    abreviation: string;

    @Prop()
    description: string;

    constructor(id: string, name: string, abreviation: string) {
        super(id);
        this.key = id;
        this.name = name;
        this.abreviation = abreviation;
    }
}

export const SkillSchema = SchemaFactory
    .createForClass(Skill)
    .index({ key: 1 }, { unique: true });