import { Inject, Injectable } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';

import { Achievement, AchievementMedia, LikeAction } from 'domain/entities';
import * as DataModel from 'domain/schemas';

import { AchievementAzblobProvider, AchievementMongoDBProvider } from 'cmd/repositories/data-providers';

import { CommonRepository } from 'cmd/repositories';
import { InvalidEntityException } from 'operational/exception';

@Injectable()
export class AchievementRepository extends CommonRepository {

    constructor(
        private readonly logPolicy: LogPolicyService,
        private readonly mongodbProvider: AchievementMongoDBProvider,
        private readonly azblobProvider: AchievementAzblobProvider) {
        super();

        this.logPolicy.trace('Init AchievementRepository', 'Init');
    }

    async getAchievementEntity(key: string): Promise<Achievement> {
        this.logPolicy.trace('Call AchievementRepository.getAchievementEntity', 'Call');

        const document = await this.mongodbProvider.getAchievementEntity(key);

        const entity = new Achievement();
        Object.assign(entity, document);

        return entity;
    }

    async saveAchievementEntity(entity: Achievement): Promise<Achievement> {
        this.logPolicy.trace('Call AchievementRepository.saveAchievementEntity', 'Call');

        if (entity) {
            const savedEntity = await this.mongodbProvider.saveAchievementEntity(entity);

            // Convert the domain entity media into a data transfer object
            // Only save the media that has a buffer (image content) and ignore all others
            // This scenario supports the 'update' action, where we don't expect to have media being updated
            entity.media
                .filter(val => val.buffer && val.buffer.byteLength > 0)
                .forEach(async element => {
                    await this.azblobProvider.saveAchievementMedia(element);
                });

            return savedEntity;
        }
        else {
            throw new InvalidEntityException("The provided achievment is null or undefined");
        }
    }

    async saveAchievementLike(entity: LikeAction): Promise<LikeAction>{
        this.logPolicy.trace('Call AchievementRepository.saveAchievementLike', 'Call');

        if (entity) {
            const savedEntity = await this.mongodbProvider.saveAchievementLike(entity);

            return savedEntity;
        }
        else {
            throw new InvalidEntityException("The provided achievment like action is null or undefined");
        }
    }

    async buildAchievementMedia(commandMedia: any[]): Promise<AchievementMedia[]> {

        const builtEntities = commandMedia && commandMedia.length > 0
            ? commandMedia.map((val, idx) => {
                // Extract the proeprties we need from the command and build a new Achievement Media
                return AchievementMedia.build(val.originalName, val.mimeType, val.buffer);
            })
            : [];

        return builtEntities;
    }

}
