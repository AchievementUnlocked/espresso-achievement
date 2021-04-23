import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { LogPolicyService } from 'operational/logging';

import { SummaryAllQuery } from 'domain/queries';

import { AchievementRepository } from 'qry/repositories';
import { HandlerResponse } from 'qry/handlers';
import { CommonQueryHandler } from 'qry/handlers/query-handlers'

@QueryHandler(SummaryAllQuery)
export class SummaryAllQueryHandler
  extends CommonQueryHandler
  implements IQueryHandler<SummaryAllQuery> {

  constructor(
    private readonly logPolicy: LogPolicyService,
    private readonly achievementRepository: AchievementRepository) {
    super();

    this.logPolicy.trace('Init SummaryAllQueryHandler', 'Init');

  }

  async execute(command: SummaryAllQuery): Promise<HandlerResponse> {

    this.logPolicy.trace('Call SummaryAllQueryHandler:execute', 'Call');

    // ? We dont need a command for this handler, since we retrieve all records
    const entities = await this.achievementRepository.getSummaryAll();

    // if the operation was successful, then we set the saved entity in the response
    const response = new HandlerResponse(entities);

    return response;
  }

}
