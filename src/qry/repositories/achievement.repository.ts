import { Injectable } from '@nestjs/common';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';

import { CreateAchievementCommand } from 'domain/commands';

import { AchievementFullDto, AchievementSummaryDto } from 'domain/schemas';
import { AchievementMongoDbProvider } from 'qry/repositories/data-providers';

@Injectable()
export class AchievementRepository {

    private readonly ACHIEVEMENT_MEDIA_BASE_URL = 'ACHIEVEMENT_MEDIA_BASE_URL';

    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService,
        private readonly mongodbProvider: AchievementMongoDbProvider) {

        this.logPolicy.trace('Init AchievementRepository', 'Init');
    }

    async getSummaryAll(): Promise<AchievementSummaryDto[]> {

        this.logPolicy.trace('Call AchievementRepository.getSummaryAll', 'Call');

        const response = await this.mongodbProvider.getSummaryAll();

        return response;
    }

}
