import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';

import { AchievementCreatedEvent } from 'domain/events';
import * as DataModel from 'domain/schemas';

import { AchievementRepository, SkillRepository, UserProfileRepository } from 'qry/repositories';

@EventsHandler(AchievementCreatedEvent)
export class AchievementCreatedEventHandler implements IEventHandler<AchievementCreatedEvent> {

    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService,
        private readonly achievementRepository: AchievementRepository,
        private readonly userProfileRepository: UserProfileRepository,
        private readonly skillRepository: SkillRepository
    ) {
        this.logPolicy.trace('Init AchievementCreatedEventHandler', 'Init');
    }

    async handle(event: AchievementCreatedEvent) {
        this.logPolicy.trace('Call AchievementCreatedEventHandler:handle', 'Call');

        const dto = await this.mapToDto(event);

        const savedDto = this.achievementRepository.saveAchievementDto(dto);
    }

    async mapToDto(event: AchievementCreatedEvent): Promise<DataModel.AchievementFullDto> {
        this.logPolicy.trace('Call AchievementCreatedEventHandler:mapToDto', 'Call');

        const achivementSkills = await this.skillRepository.getSkills(event.skills);

        const achievementUserProfile = await this.userProfileRepository.getUserProfile(event.userName);

        const achievementMedia = event.mediaPaths.map(val => {
            return {
                mediaPath: val.mediaPath, originalName: val.originalName, size: val.size, mimeType: val.mimeType,
            } as DataModel.AchievementMediaFullDto;
        });

        const dto: DataModel.AchievementFullDto = {
            key: event.achievementKey,
            title: event.title,
            description: event.description,
            completedDate: event.completedDate,
            visibility: event.visibility,
            skills: achivementSkills,
            media: achievementMedia,
            userProfile: achievementUserProfile
        };

        return dto;
    }

}

