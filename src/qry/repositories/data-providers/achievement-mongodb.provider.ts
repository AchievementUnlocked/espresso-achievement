import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogPolicyService } from 'operational/logging';

import * as DataModel from 'domain/schemas';

@Injectable()
export class AchievementMongoDbProvider {

    constructor(
        private readonly logPolicy: LogPolicyService,
        @InjectModel(DataModel.AchievementFullDto.name)
        private achievementFullModel: Model<DataModel.AchievementFullDocument>) {

        this.logPolicy.trace('Init AchievementMongoDBProvider', 'Init');
    }


    async getSummaryAll(): Promise<DataModel.AchievementSummaryDto[]> {
        this.logPolicy.trace('Call AchievementMongoDbProvider.getAll', 'Call');

        const projectedProps = DataModel.AchievementSummaryDto.getProjectedProps().join(' ');
        
        this.logPolicy.debug('PROJECTED PROPS');
        this.logPolicy.debug(projectedProps);

        const response = await this.achievementFullModel.find(null, projectedProps).exec();

        return response;
    }

    async saveAchievementDto(dto: DataModel.AchievementFullDto): Promise<DataModel.AchievementFullDto> {
        this.logPolicy.trace('Call AchievementMongoDBProvider.saveAchievementDto', 'Call');

        const document = await this.achievementFullModel.findOneAndUpdate(
            { key: dto.key },
            dto,
            { returnOriginal: false, upsert: true, useFindAndModify: false }
        );

        return document;
    }
}
