import { Inject, Injectable } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';

import { Achievement } from 'domain/entities';
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

        const savedEntity = await this.mongodbProvider.getAchievementEntity(key);

        return savedEntity;
    }

    async saveAchievementEntity(entity: Achievement): Promise<Achievement> {
        this.logPolicy.trace('Call AchievementRepository.saveAchievementEntity', 'Call');

        const savedEntity = await this.mongodbProvider.saveAchievementEntity(entity);

        return savedEntity;
    }

    async saveAchievementDto(entity: Achievement): Promise<DataModel.AchievementFullDto> {
        this.logPolicy.trace('Call AchievementRepository.saveAchievementDto', 'Call');


        if (entity) {
            if (entity.userProfile) {
                // Convert the domain entity into a data transfer object
                const achievementDto = DataModel.AchievementFullDto.fromDomain(entity);

                const savedDto = await this.mongodbProvider.saveAchievementDto(achievementDto);

                // Convert the domain entity media into a data transfer object
                // Only save the media that has a buffer (image content) and ignore all others
                // This scenario supports the 'update' action, where we don't expect to have media being updated
                const achievementMediaDto = entity.media
                    ? entity.media.filter(val => val.buffer && val.buffer.byteLength > 0)
                        .map((val) => {
                            return DataModel.AchevementMediaFullDto.fromDomain(val);
                        })
                    : [];

                if (achievementMediaDto && achievementMediaDto.length > 0) {
                    await this.azblobProvider.saveAchievementMediaDto(achievementMediaDto);

                    // If the meia was saved sucessfully, clear the buffer so the image is not ocupying memory space
                    entity.media.forEach((item) => {
                        item.clearBuffer();
                    });
                }
                return savedDto;
            }
            else {
                throw new InvalidEntityException("The provided achievment user is null or undefined");
            }
        }
        else {
            throw new InvalidEntityException("The provided achievment is null or undefined");
        }
    }
}
