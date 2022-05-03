import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { LogPolicyService } from 'operational/logging';

import * as DataModel from 'domain/schemas';

@Injectable()
export class SkillCacheProvider {

    private readonly SKILL_CACHE_KEY = 'SKILL_CACHE_KEY';

    constructor(
        private readonly logPolicy: LogPolicyService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache) {

        this.logPolicy.trace('Init SkillCacheProvider', 'Init');
    }

    async getSkills(setterCallback: () => Promise<DataModel.SkillFullDto[]>): Promise<DataModel.SkillFullDto[]> {
        this.logPolicy.trace('Call SkillCacheProvider.getSkills', 'Call');

        let entities = new Array<DataModel.SkillFullDto>();

        entities = await this.cacheManager.get(this.SKILL_CACHE_KEY);

        if (!entities) {
            this.logPolicy.error(`CACHE IS EMPTY FOR '${this.SKILL_CACHE_KEY}'`);
            entities = await setterCallback();

            if (entities && entities.length > 0) {
                await this.cacheManager.set(this.SKILL_CACHE_KEY, entities, { ttl: 24 * 60 * 60 });
            }
        }

        return entities;
    }

}
