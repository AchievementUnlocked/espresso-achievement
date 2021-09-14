import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NotImplementedException } from '@nestjs/common';

import { LogPolicyService } from 'operational/logging';
import { ErrorPolicyService } from 'operational/exception';

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
    private readonly eventBus: EventBus,
    private readonly achievementRepository: AchievementRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly skillRepository: SkillRepository) {
    super();

    this.logPolicy.trace('Init UpdateAchievementContentCommandHandler', 'Init');

  }

  async execute(command: UpdateAchievementContentCommand): Promise<HandlerResponse> {

    this.logPolicy.trace('Call UpdateAchievementContentCommandHandler:execute', 'Call');
    
    const entity = await this.mergeToEntity(command, new Achievement(command.key));

    // await this.achievementRepository.saveAchievementEntity(entity);

    // await this.achievementRepository.saveAchievementDto(entity);

    // TODO: Event Handler: Raise handle complete event

    // if the operation was successful, then we set the saved entity in the response
    const response = new HandlerResponse(entity);

    return response;
  }

  async mapToEntity(command: UpdateAchievementContentCommand): Promise<Achievement> {

    this.logPolicy.trace('Call UpdateAchievementContentCommandHandler.mapToEntity', 'Call');

    throw new NotImplementedException('Not Implemented: UpdateAchievementContentCommandHandler.mapToEntity');
  }

  async mergeToEntity(command: UpdateAchievementContentCommand, entity: Achievement): Promise<Achievement> {

    this.logPolicy.trace('Call UpdateAchievementContentCommandHandler.mergeToEntity', 'Call');
        
    return entity;
  }
}
