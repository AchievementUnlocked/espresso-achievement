import { Controller, HttpCode, UseInterceptors, UseFilters, INestApplication, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { LogPolicyService, LogRequestInterceptor } from 'operational/logging';
import { AppExceptionFilter } from 'operational/exception';

import { SummaryAllQuery } from 'domain/queries';

import { HandlerResponse } from 'qry/handlers';
import { CommonController, ControlerErrors } from 'qry/api';

@Controller('achievement/qry')
@UseInterceptors(LogRequestInterceptor)
@UseFilters(AppExceptionFilter)
export class AchievementQryController extends CommonController {

    constructor(
        private readonly logPolicy: LogPolicyService,
        private readonly queryBus: QueryBus) {

        super();

        this.logPolicy.trace('Init AchievementController Qry', 'Init');
    }



    @Get('summary/all')
    @HttpCode(200)
    async getSummaryAll() {
        this.logPolicy.trace('Call AchievementController.createAchievementWithFile', 'Call');

        try {
            const query = new SummaryAllQuery();

            const response = await this.queryBus.execute(query) as HandlerResponse;

            this.logPolicy.debug('RESPONSE');
            this.logPolicy.debug(response.data?.map(val => { return val.title }));

            return response;
        } catch (error) {
            this.handleError(error, ControlerErrors.GetAchievementSummaryError);
        }
    }
}
