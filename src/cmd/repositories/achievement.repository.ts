import { Inject, Injectable } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';

import { Achievement } from 'domain/entities';
import * as DataModel from 'domain/schemas';

import { AchievementAzblobProvider, AchievementMongoDBProvider } from 'cmd/repositories/data-providers';

import { CommonRepository } from 'cmd/repositories';

@Injectable()
export class AchievementRepository extends CommonRepository {

    constructor(
        private readonly logPolicy: LogPolicyService,
        private readonly mongodbProvider: AchievementMongoDBProvider,
        private readonly azblobProvider: AchievementAzblobProvider) {
        super();

        this.logPolicy.trace('Init AchievementRepository', 'Init');
    }

    async saveAchievement(entity: Achievement): Promise<Achievement> {
        this.logPolicy.trace('Call AchievementRepository.saveAchievement', 'Call');

        // Convert the domain entity into a data transfer object
        const achievementDto = DataModel.AchievementFullDto.fromDomain(entity);
        const achievementMediaDto = entity.media.map((val) => {
            return DataModel.AchevementMediaFullDto.fromDomain(val);
        });

        await this.mongodbProvider.saveAchievement(achievementDto);
        await this.azblobProvider.saveAchievementMedia(achievementMediaDto);

        // If the meia was saved sucessfully, clear the buffer so the image is not ocupying memory space
        entity.media.forEach((item) => {
            item.clearBuffer();
        });

        return entity;
    }
}
