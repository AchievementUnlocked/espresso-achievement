import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';

import { AchievementLikeAddedEvent } from 'domain/events';
import * as DataModel from 'domain/schemas';

import { AchievementRepository, SkillRepository, UserProfileRepository } from 'qry/repositories';

@EventsHandler(AchievementLikeAddedEvent)
export class AchievementLikeAddedEventHandler implements IEventHandler<AchievementLikeAddedEvent> {

    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService,
        private readonly achievementRepository: AchievementRepository,
        private readonly userProfileRepository: UserProfileRepository,
        private readonly skillRepository: SkillRepository
    ) {
        this.logPolicy.trace('Init AchievementLikeAddedEventHandler', 'Init');
    }

    async handle(event: AchievementLikeAddedEvent) {
        this.logPolicy.trace('Call AchievementLikeAddedEventHandler:handle', 'Call');

        const dto = await this.mergeToDto(event);

        const savedDto = await this.achievementRepository.saveAchievementDto(dto);
    }

    async mergeToDto(event: AchievementLikeAddedEvent): Promise<DataModel.AchievementFullDto> {
        this.logPolicy.trace('Call AchievementLikeAddedEventHandler:mergeToDto', 'Call');

        const userProfile = await this.userProfileRepository.getUserProfile(event.userName);
        const achievement = await this.achievementRepository.getAchievementDto(event.achievementKey);

        const likeAction = new DataModel.LikeActionFullDto();
        likeAction.likeCount = event.likeCount;
        likeAction.userProfile = userProfile;

        // Need to check that the 'likes' array is not null, which could happen if this is an older achievement
        if (!achievement.likes)
            achievement.likes = new Array<DataModel.LikeActionFullDto>();

        achievement.likes.push(likeAction);

        return achievement;
    }

}

