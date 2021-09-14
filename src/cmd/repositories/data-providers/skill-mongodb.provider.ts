import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogPolicyService } from 'operational/logging';

import {Skill, SkillDocument} from 'domain/entities';

@Injectable()
export class SkillMongoDbProvider {

    constructor(
        private readonly logPolicy: LogPolicyService,
        @InjectModel(Skill.name)
        private skillModel: Model<SkillDocument>) {

        this.logPolicy.trace('Init SkillMongoDbProvider', 'Init');
    }

    async getSkills(): Promise<Skill[]> {
        this.logPolicy.trace('Call SkillMongoDbProvider.getSkills', 'Call');

        // const dtoList = await this.skillModel.find().exec();
        const entities = new Array<Skill>();

        entities.push(
            new Skill( 'str','strength', 'str'), 
            new Skill( 'dex','dexterity', 'dex'),
            new Skill( 'con','constitution', 'con'),
            new Skill( 'int','intelligence', 'int'),
            new Skill( 'wis','wisdom', 'wis'),
            new Skill( 'cha','charisma', 'cha'),
            new Skill( 'luc','luck', 'luc'),
        );

        return entities;
    }

}
