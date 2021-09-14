import { Injectable } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';

import { UserProfile } from 'domain/entities';

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

    async getUserProfile(userName: string): Promise<UserProfile> {
        this.logPolicy.trace('Call UserProfileRepository.getUserProfile', 'Call');

        // TODO: REFACTOR - Try to ge tthe user profile from the cache first, then from the mongoDB repository
        const entity = await this.mongodbProvider.getUserProfile(userName);

        return entity;
    }
}
