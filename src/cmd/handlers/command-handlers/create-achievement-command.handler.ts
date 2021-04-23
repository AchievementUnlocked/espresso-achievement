import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NotImplementedException } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';
import { ErrorPolicyService } from 'operational/exception';

import { Achievement, AchievementMedia, Skill } from 'domain/entities';
import { CreateAchievementCommand } from 'domain/commands';
import { CreateAchievementCompletedEvent } from 'domain/events';
import { CodeGeneratorUtil, MimeTypeUtil } from 'domain/utils';

import { AchievementRepository, UserProfileRepository, SkillRepository } from 'cmd/repositories';

import { HandlerResponse } from 'cmd/handlers';

import { CommonCommandHandler } from 'cmd/handlers/command-handlers';

@CommandHandler(CreateAchievementCommand)
export class CreateAchievementCommandHandler
  extends CommonCommandHandler
  implements ICommandHandler<CreateAchievementCommand> {

  constructor(
    private readonly logPolicy: LogPolicyService,
    private readonly eventBus: EventBus,
    private readonly achievementRepository: AchievementRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly skillRepository: SkillRepository) {
    super();

    this.logPolicy.trace('Init CreateAchievementCommandHandler', 'Init');

  }

  async execute(command: CreateAchievementCommand): Promise<HandlerResponse> {

    this.logPolicy.trace('Call CreateAchievementCommandHandler:execute', 'Call');

    const entity = await this.mapToEntity(command);
    const savedEntity = await this.achievementRepository.saveAchievement(entity);

    // ! There is o need to send an event right now, since we're moving the writing of the de-normalized achivement in this command service
    // Raise handle complete event
    // const completedEvent = new CreateAchievementCompletedEvent(savedEntity);
    // this.eventBus.publish(completedEvent);

    // if the operation was successful, then we set the saved entity in the response
    const response = new HandlerResponse(savedEntity);

    return response;
  }

  async mapToEntity(command: CreateAchievementCommand): Promise<Achievement> {

    this.logPolicy.trace('Call CreateAchievementCommandHandler.mapToEntity', 'Call');

    const entity = new Achievement(CodeGeneratorUtil.GenerateShortCode());

    entity.title = command.title;
    entity.description = command.description;
    entity.completedDate = command.completedDate;
    entity.visibility = command.visibility as number;

    const skills = await this.skillRepository.getSkills();

    entity.skills = skills.filter(item => command.skills.indexOf(item.key) !== -1);

    entity.media = command.media.map((val, idx) => {
      const mediaEntity = new AchievementMedia(CodeGeneratorUtil.GenerateShortCode());

      // Get the extension from the mmime type of teh file
      const extension = MimeTypeUtil.getExtension(val.mimeType);

      mediaEntity.mediaPath = `${entity.key}/${mediaEntity.key}_${idx}.${extension}`;
      mediaEntity.originalName = val.originalName;
      mediaEntity.mimeType = val.mimeType;
      mediaEntity.size = val.size;
      mediaEntity.buffer = val.buffer;

      return mediaEntity;
    });

    entity.userProfile = await this.userProfileRepository.getUserProfile(command.userName);

    return entity;
  }

  async mergeToEntity(command: CreateAchievementCommand, entity: Achievement): Promise<Achievement> {

    this.logPolicy.error('Call CreateAchievementCommandHandler.mapToEntity', 'Call');
    throw new NotImplementedException('Not Implemented: CreateAchievementCommandHandler.mapToEntity');

  }
}
