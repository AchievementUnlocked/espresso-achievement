import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogPolicyService } from 'operational/logging';

import { Achievement,AchievementDocument } from 'domain/entities';
import * as DataModel from 'domain/schemas';

@Injectable()
export class AchievementMongoDBProvider {

    constructor(
        private readonly logPolicy: LogPolicyService,
        @InjectModel(Achievement.name)
        private achievementEntityModel: Model<AchievementDocument>,
        @InjectModel(DataModel.AchievementFullDto.name)
        private achievementModel: Model<DataModel.AchievementFullDocument>) {

        this.logPolicy.trace('Init AchievementMongoDBProvider', 'Init');
    }

    async saveAchievementEntity(entity: Achievement): Promise<Achievement> {
        this.logPolicy.trace('Call AchievementMongoDBProvider.saveAchievementEntity', 'Call');

        const createdAchievement = new this.achievementEntityModel(entity);
        const document = await createdAchievement.save();

        return document;
    }

    async saveAchievementDto(dto: DataModel.AchievementFullDto): Promise<DataModel.AchievementFullDto> {
        this.logPolicy.trace('Call AchievementMongoDBProvider.saveAchievementDto', 'Call');

        const createdAchievement = new this.achievementModel(dto);
        const document = await createdAchievement.save();

        return document;
    }
}
