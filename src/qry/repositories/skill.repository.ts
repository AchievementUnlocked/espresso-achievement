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

    async getSkills(keys: string[] = null): Promise<DataModel.SkillFullDto[]> {

        const dtoList = await this.cacheProvider.getSkills(async () => this.mongoDbProvider.getSkills());

        const filteredList = keys && keys.length > 0
            ? dtoList.filter(item => keys.indexOf(item.key) !== -1)
            : dtoList;

        return filteredList;
    }

}
