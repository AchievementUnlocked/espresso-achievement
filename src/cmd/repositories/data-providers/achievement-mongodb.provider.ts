import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogPolicyService } from 'operational/logging';

import { Achievement, AchievementDocument, LikeAction, LikeActionDocument } from 'domain/entities';
import * as DataModel from 'domain/schemas';
import { title } from 'process';

@Injectable()
export class AchievementMongoDBProvider {

    constructor(
        private readonly logPolicy: LogPolicyService,

        @InjectModel(Achievement.name)
        private achievementEntityModel: Model<AchievementDocument>,
        @InjectModel(LikeAction.name)
        private likeEntityModel: Model<LikeActionDocument>) {

        this.logPolicy.trace('Init AchievementMongoDBProvider', 'Init');
    }


    async getAchievementEntity(key: string): Promise<Achievement> {
        this.logPolicy.trace('Call AchievementMongoDBProvider.getAchievementEntity', 'Call');

        const document = await this.achievementEntityModel.findOne({ key: key }).lean<Achievement>().exec();

        return document;
    }

    async getAchivementLikes(key: string): Promise<LikeAction[]> {
        this.logPolicy.trace('Call AchievementMongoDBProvider.getAchivementLikes', 'Call');

        const document = await this.likeEntityModel
            .find({ achievementKey: key })
            .lean<LikeAction[]>()
            .exec();

        return document;
    }


    async saveAchievementEntity(entity: Achievement): Promise<Achievement> {
        this.logPolicy.trace('Call AchievementMongoDBProvider.saveAchievementEntity', 'Call');

        const document = await this.achievementEntityModel.findOneAndUpdate(
            // { key: entity.key, timestamp: { $lte: entity.timestamp } },
            { key: entity.key },
            entity,
            { returnOriginal: false, upsert: true, useFindAndModify: false }
        );

        this.logPolicy.debug(document);

        return document;
    }


    async saveAchievementLike(entity: LikeAction): Promise<LikeAction> {
        this.logPolicy.trace('Call AchievementMongoDBProvider.saveAchievementLike', 'Call');

        const document = await this.likeEntityModel.create(entity);

        document.save({ checkKeys: false });

        this.logPolicy.debug(document);

        return document;
    }

}
