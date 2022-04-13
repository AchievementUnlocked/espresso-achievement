import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogPolicyService } from 'operational/logging';

import * as DataModel from 'domain/schemas';

@Injectable()
export class SkillMongoDbProvider {

    constructor(
        private readonly logPolicy: LogPolicyService,
        @InjectModel(DataModel.SkillFullDto.name)
        private skillModel: Model<DataModel.SkillFullDocument>) {

        this.logPolicy.trace('Init SkillMongoDbProvider', 'Init');
    }

    async getSkills(): Promise<DataModel.SkillFullDto[]> {
        this.logPolicy.trace('Call SkillMongoDbProvider.getSkills', 'Call');

        // const dtoList = await this.skillModel.find().exec();
        const entities = new Array<DataModel.SkillFullDto>();

        // TODO: TEMPORARY
        entities.push(
            {key: 'str', name: 'strength', abreviation: 'str'},
            {key: 'dex', name: 'dexterity', abreviation: 'dex'},
            {key: 'con', name: 'constitution', abreviation: 'con'},
            {key: 'int', name: 'intelligence', abreviation: 'int'},
            {key: 'wis', name: 'wisdom', abreviation: 'wis'},
            {key: 'cha', name: 'charisma', abreviation: 'cha'},
            {key: 'luc', name: 'luck', abreviation: 'luc'},            
        );

        return entities;
    }

}
