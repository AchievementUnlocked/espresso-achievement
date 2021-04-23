import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogPolicyService } from 'operational/logging';

import * as DataModel from 'domain/schemas';

@Injectable()
export class AchievementMongoDBProvider {

    constructor(
        private readonly logPolicy: LogPolicyService,
        @InjectModel(DataModel.AchievementFullDto.name)
        private achievementModel: Model<DataModel.AchievementFullDocument>) {

        this.logPolicy.trace('Init AchievementMongoDBProvider', 'Init');
    }

    async saveAchievement(dto: DataModel.AchievementFullDto): Promise<DataModel.AchievementFullDto> {
        this.logPolicy.trace('Call AchievementMongoDBProvider.saveAchievement', 'Call');

        const createdAchievement = new this.achievementModel(dto);
        const document = await createdAchievement.save();

        return document;
    }
}
