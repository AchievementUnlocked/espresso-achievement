import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogPolicyService } from 'operational/logging';

import {UserProfile, UserProfileDocument} from 'domain/entities';

@Injectable()
export class UserProfileMongoDBProvider {

    constructor(
        private readonly logPolicy: LogPolicyService,
        @InjectModel(UserProfile.name)
        private userProfileModel: Model<UserProfileDocument>) {

        this.logPolicy.trace('Init UserProfileMongoDBProvider', 'Init');
    }

    async getUserProfile(user: string): Promise<UserProfile> {
        this.logPolicy.trace('Call UserProfileMongoDBProvider.getUserProfile', 'Call');

        const entity = await this.userProfileModel.findOne({ userName: user }).exec();

        return entity;
    }

}
