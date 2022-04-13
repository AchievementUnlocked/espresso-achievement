import moment from 'moment';
import { CommandHandler, EventBus, ICommandHandler, IEvent } from '@nestjs/cqrs';
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

        const entity: Achievement = await this.achievementRepository.getAchievementEntity(command.key) as Achievement;

        if (entity) {
          const mergedEntity = await this.mergeToEntity(command, entity);

          const savedEntity = await this.achievementRepository.saveAchievementEntity(mergedEntity);

          const events = entity.getUncommittedEvents() as IEvent[];
          events.forEach(evt => this.eventBus.publish(evt));

          response = new HandlerResponse(savedEntity);

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

      const achievementSkills = await this.skillRepository.getSkills(command.skills);

      entity.updateContent(command.title, command.description, command.completedDate, command.visibility, achievementSkills);
    }

    return entity;
  }
}
