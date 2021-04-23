import { Injectable } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';
import * as DataModel from 'domain/schemas';

@Injectable()
export class AchievementConsoleDbProvider {
    constructor(private readonly logPolicy: LogPolicyService) {

        this.logPolicy.trace('Init AchievementMongoDBProvider', 'Init');
    }

    async saveAchievement(dto: DataModel.AchievementFullDto): Promise<DataModel.AchievementFullDto> {
        this.logPolicy.trace('Call AchievementMongoDBProvider.saveAchievement', 'Call');

        this.logPolicy.debug(dto);

        return null;
    }
}
