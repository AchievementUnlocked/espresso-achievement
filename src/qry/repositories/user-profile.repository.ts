import { Injectable } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';

import * as DataModel from 'domain/schemas';

import { UserProfileMongoDBProvider } from './data-providers';

import { CommonRepository } from '.';

@Injectable()
export class UserProfileRepository extends CommonRepository {

    constructor(
        private readonly logPolicy: LogPolicyService,
        private readonly mongodbProvider: UserProfileMongoDBProvider) {
        super();

        this.logPolicy.trace('Init AchievementRepository', 'Init');
    }

    async getUserProfile(userName: string): Promise<DataModel.UserProfileFullDto> {
        this.logPolicy.trace('Call UserProfileRepository.getUserProfile', 'Call');
        
        const entity = await this.mongodbProvider.getUserProfileDto(userName);

        return entity;
    }
}
