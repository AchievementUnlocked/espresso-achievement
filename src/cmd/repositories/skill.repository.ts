import { Injectable } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';

import { Skill } from 'domain/entities';

import * as DataModel from 'domain/schemas';

import { SkillCacheProvider, SkillMongoDbProvider } from './data-providers';

import { CommonRepository } from '.';

@Injectable()
export class SkillRepository extends CommonRepository {

    constructor(
        private readonly logPolicy: LogPolicyService,
        private readonly cacheProvider: SkillCacheProvider,
        private readonly mongoDbProvider: SkillMongoDbProvider) {
        super();

        this.logPolicy.trace('Init SkillRepository', 'Init');
    }

    async getSkills(): Promise<Skill[]> {

        const dtoList = await this.cacheProvider.getSkills(async () => this.mongoDbProvider.getSkills());

        return dtoList.map((item) => DataModel.SkillFullDto.toDomain(item));
    }

}
