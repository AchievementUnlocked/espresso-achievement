import moment from 'moment';
import { CommandHandler, EventBus, ICommandHandler, IEvent } from '@nestjs/cqrs';
import { NotImplementedException } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';
import { ErrorPolicyService, EntityNotFoundException, InvalidCommandException } from 'operational/exception';

import { Achievement, AchievementMedia, Skill } from 'domain/entities';
import { LikeAchievementCommand, UpdateAchievementContentCommand } from 'domain/commands';

import { CodeGeneratorUtil, MimeTypeUtil } from 'domain/utils';

import { AchievementRepository, UserProfileRepository, SkillRepository } from 'cmd/repositories';

import { HandlerResponse } from 'cmd/handlers';

import { CommonCommandHandler } from 'cmd/handlers/command-handlers';
import { LikeAction } from 'domain/entities/like-action';

@CommandHandler(LikeAchievementCommand)
export class LikeAchievementCommandHandler
  extends CommonCommandHandler
  implements ICommandHandler<LikeAchievementCommand>
{

  constructor(
    private readonly logPolicy: LogPolicyService,
    private readonly errorPolicy: ErrorPolicyService,
    private readonly eventBus: EventBus,
    private readonly achievementRepository: AchievementRepository,
    private readonly userProfileRepository: UserProfileRepository) {
    super();

    this.logPolicy.trace('Init LikeAchievementCommandHandler', 'Init');

  }

  async execute(command: LikeAchievementCommand): Promise<HandlerResponse> {
    let response: HandlerResponse;

    try {
      this.logPolicy.trace('Call LikeAchievementCommand:execute', 'Call');

      if (command) {

        const entity = await this.achievementRepository.getAchievementEntity(command.key);

        if (entity) {

            const likeAction = entity.addLike(command.commandingUser, command.likeCount);

            // At this point we need to save the like action but not the achievement entity again.
            // The reason is that this operation can be called by many processes/threads that want to add a like to single achievement
            // Causing a potential overwrite between the requests.  Instead, we are going to send the event to a queue/topic and
            // add the new like synchrounosly by one of many services instances observing the achievements.
            await this.achievementRepository.saveAchievementLike(likeAction);

            const events = entity.getUncommittedEvents() as IEvent[];
            events.forEach(evt => this.eventBus.publish(evt));

            response = new HandlerResponse(entity);
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

  async mapToEntity(command: LikeAchievementCommand): Promise<Achievement> {
    this.logPolicy.trace('Call LikeAchievementCommandHandler.mapToEntity', 'Call');

    throw new NotImplementedException('Not Implemented: LikeAchievementCommandHandler.mapToEntity');
  }

  async mergeToEntity(command: LikeAchievementCommand, entity: Achievement): Promise<Achievement> {
    this.logPolicy.trace('Call LikeAchievementCommandHandler.mergeToEntity', 'Call');

    throw new NotImplementedException('Not Implemented: LikeAchievementCommandHandler.mergeToEntity');
  }

}
