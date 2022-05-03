import { CommandHandler, EventBus, ICommandHandler, IEvent } from '@nestjs/cqrs';
import { NotImplementedException } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';
import { EntityNotFoundException, ErrorPolicyService, InvalidCommandException } from 'operational/exception';

import { Achievement, AchievementMedia, AchievementVisibility, Skill } from 'domain/entities';
import { CreateAchievementCommand } from 'domain/commands';
import { AchievementCreatedEvent } from 'domain/events';
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
    private readonly errorPolicy: ErrorPolicyService,
    private readonly eventBus: EventBus,
    private readonly achievementRepository: AchievementRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly skillRepository: SkillRepository) {
    super();

    this.logPolicy.trace('Init CreateAchievementCommandHandler', 'Init');

  }

  async execute(command: CreateAchievementCommand): Promise<HandlerResponse> {

    let response: HandlerResponse;


    try {
      this.logPolicy.trace('Call CreateAchievementCommandHandler:execute', 'Call');

      if (command) {
        const entity: Achievement = await this.mapToEntity(command);

        const savedEntity = await this.achievementRepository.saveAchievementEntity(entity);

        const events = entity.getUncommittedEvents() as IEvent[];
        events.forEach(evt => this.eventBus.publish(evt));

        response = new HandlerResponse(savedEntity);
      }
      else {
        throw new InvalidCommandException('The provided command is null or invalid');
      }

    } catch (error) {
      response = new HandlerResponse(null, error, command);

      this.errorPolicy.handleError(error);
    }

    return response;
  }

  async mapToEntity(command: CreateAchievementCommand): Promise<Achievement> {

    this.logPolicy.trace('Call CreateAchievementCommandHandler.mapToEntity', 'Call');

    const achievementUserProfile = await this.userProfileRepository.getUserProfile(command.userName);

    if (achievementUserProfile) {

      const achivementSkills = await this.skillRepository.getSkills(command.skills);
      const achievementMedia = await this.achievementRepository.buildAchievementMedia(command.media);

      // We want to let the entity generate its own key, so we send null
      const entity = new Achievement(null,
        command.title, command.description, command.completedDate, command.visibility,
        achievementUserProfile, achivementSkills, achievementMedia
      );

      return entity;
    }
    else {
      throw new EntityNotFoundException(`The user profile entity with userName '${command.userName}' was not found.`);
    }
  }

  async mergeToEntity(command: CreateAchievementCommand, entity: Achievement): Promise<Achievement> {

    this.logPolicy.error('Call CreateAchievementCommandHandler.mapToEntity', 'Call');
    throw new NotImplementedException('Not Implemented: CreateAchievementCommandHandler.mapToEntity');

  }
}
