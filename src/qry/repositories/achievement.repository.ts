

import { Injectable } from '@nestjs/common';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';
import { InvalidEntityException } from 'operational/exception';

import * as DataModel from 'domain/schemas';

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

    async getSummaryAll(): Promise<DataModel.AchievementSummaryDto[]> {

        this.logPolicy.trace('Call AchievementRepository.getSummaryAll', 'Call');

        const response = await this.mongodbProvider.getSummaryAll();

        return response;
    }

    async getAchievementDto(key: string): Promise<DataModel.AchievementFullDto> {
        this.logPolicy.trace('Call AchievementRepository.getAchievementDto', 'Call');

        const dto = await this.mongodbProvider.getAchievementDto(key);

        return dto;
    }

    async saveAchievementDto(dto: DataModel.AchievementFullDto): Promise<DataModel.AchievementFullDto> {
        this.logPolicy.trace('Call AchievementRepository.saveAchievementDto', 'Call');

        if (dto) {
            if (dto.userProfile) {

                const savedDto = await this.mongodbProvider.saveAchievementDto(dto);

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
