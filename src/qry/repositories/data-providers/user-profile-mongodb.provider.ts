import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogPolicyService } from 'operational/logging';

import * as DataModel from 'domain/schemas';

@Injectable()
export class UserProfileMongoDBProvider {

    constructor(
        private readonly logPolicy: LogPolicyService,
        @InjectModel(DataModel.UserProfileFullDto.name)
        private userProfileModel: Model<DataModel.UserProfileFullDocument>) {

        this.logPolicy.trace('Init UserProfileMongoDBProvider', 'Init');
    }

    async getUserProfileDto(userName: string): Promise<DataModel.UserProfileFullDto> {
        this.logPolicy.trace('Call UserProfileMongoDBProvider.getUserProfile', 'Call');

        const dto = await this.userProfileModel.findOne({ userName: userName }).exec();

        return dto;
    }

}
