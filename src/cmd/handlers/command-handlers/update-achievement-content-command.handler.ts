import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NotImplementedException } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';
import { ErrorPolicyService, EntityNotFoundException, InvalidCommandException } from 'operational/exception';

import { Achievement, AchievementMedia, Skill } from 'domain/entities';
import { UpdateAchievementContentCommand } from 'domain/commands';

import { CodeGeneratorUtil, MimeTypeUtil } from 'domain/utils';

import { AchievementRepository, UserProfileRepository, SkillRepository } from 'cmd/repositories';

import { HandlerResponse } from 'cmd/handlers';

import { CommonCommandHandler } from 'cmd/handlers/command-handlers';

@CommandHandler(UpdateAchievementContentCommand)
export class UpdateAchievementContentCommandHandler
  extends CommonCommandHandler
  implements ICommandHandler<UpdateAchievementContentCommand> {

  constructor(
    private readonly logPolicy: LogPolicyService,
    private readonly errorPolicy: ErrorPolicyService,
    private readonly eventBus: EventBus,
    private readonly achievementRepository: AchievementRepository,
    private readonly skillRepository: SkillRepository) {
    super();

    this.logPolicy.trace('Init UpdateAchievementContentCommandHandler', 'Init');

  }

  async execute(command: UpdateAchievementContentCommand): Promise<HandlerResponse> {

    let response: HandlerResponse;

    try {
      this.logPolicy.trace('Call UpdateAchievementContentCommandHandler:execute', 'Call');

      if (command) {
        const entity = await this.achievementRepository.getAchievementEntity(command.key);

        if (entity) {
          const mergedEntity = await this.mergeToEntity(command, entity);

          await this.achievementRepository.saveAchievementEntity(mergedEntity);

          await this.achievementRepository.saveAchievementDto(mergedEntity);

          // TODO: Event Handler: Raise handle complete event

          // if the operation was successful, then we set the saved entity in the response
          response = new HandlerResponse(mergedEntity);

        }
        else {
          throw new EntityNotFoundException(`The achievement entity with key '${command.key}' was not found.`);
        }
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

  async mapToEntity(command: UpdateAchievementContentCommand): Promise<Achievement> {

    this.logPolicy.trace('Call UpdateAchievementContentCommandHandler.mapToEntity', 'Call');

    throw new NotImplementedException('Not Implemented: UpdateAchievementContentCommandHandler.mapToEntity');
  }

  async mergeToEntity(command: UpdateAchievementContentCommand, entity: Achievement): Promise<Achievement> {

    this.logPolicy.trace('Call UpdateAchievementContentCommandHandler.mergeToEntity', 'Call');

    if (command && entity) {
      entity.title = command.title || entity.title;
      entity.description = command.description || entity.description;
      entity.completedDate = command.completedDate || entity.completedDate;
      entity.visibility = command.visibility || entity.visibility;

      if (command.skills && command.skills.length > 0) {
        const skills = await this.skillRepository.getSkills();

        entity.skills = skills.filter(item => command.skills.indexOf(item.key) !== -1);
      }
    }

    return entity;
  }
}
