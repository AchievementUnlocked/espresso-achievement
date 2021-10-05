import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NotImplementedException } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';
import { EntityNotFoundException, ErrorPolicyService, InvalidCommandException } from 'operational/exception';

import { Achievement, AchievementMedia, AchievementVisibility, Skill } from 'domain/entities';
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
        const entity = await this.mapToEntity(command);

        await this.achievementRepository.saveAchievementEntity(entity);

        await this.achievementRepository.saveAchievementDto(entity);

        // TODO: Event Handler: Raise handle complete event
        // const completedEvent = new CreateAchievementCompletedEvent(entity);
        // this.eventBus.publish(completedEvent);

        // if the operation was successful, then we set the saved entity in the response
        response = new HandlerResponse(entity);
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

    const userProfile = await this.userProfileRepository.getUserProfile(command.userName);

    if (userProfile) {
      const entity = new Achievement(CodeGeneratorUtil.GenerateShortCode());

      entity.userProfile = userProfile;

      entity.title = command.title;
      entity.description = command.description;
      entity.completedDate = command.completedDate;

      entity.visibility = command.visibility
        ? command.visibility as number
        : AchievementVisibility.Private;

      const skills = await this.skillRepository.getSkills();

      entity.skills = command.skills && command.skills.length > 0
        ? skills.filter(item => command.skills.indexOf(item.key) !== -1)
        : [];

      entity.media = command.media && command.media.length > 0
        ? command.media.map((val, idx) => {
          const mediaEntity = new AchievementMedia(CodeGeneratorUtil.GenerateShortCode());

          // Get the extension from the mmime type of teh file
          const extension = MimeTypeUtil.getExtension(val.mimeType);

          mediaEntity.mediaPath = `${entity.key}/${mediaEntity.key}_${idx}.${extension}`;
          mediaEntity.originalName = val.originalName;
          mediaEntity.mimeType = val.mimeType;
          mediaEntity.size = val.size;
          mediaEntity.buffer = val.buffer;

          return mediaEntity;
        })
        : [];


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
