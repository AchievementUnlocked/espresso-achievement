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

        let dtoList = new Array<DataModel.SkillFullDto>();

        dtoList = await this.cacheManager.get(this.SKILL_CACHE_KEY);

        if (!dtoList) {
            this.logPolicy.error(`CACHE IS EMPTY FOR '${this.SKILL_CACHE_KEY}'`);
            dtoList = await setterCallback();

            if (dtoList && dtoList.length > 0) {
                await this.cacheManager.set(this.SKILL_CACHE_KEY, dtoList, { ttl: 24 * 60 * 60 });
            }
        }

        return dtoList as DataModel.SkillFullDto[];
    }

}
