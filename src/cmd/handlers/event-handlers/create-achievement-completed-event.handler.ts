import { HttpService } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';

import { CreateAchievementCompletedEvent } from 'domain/events';

@EventsHandler(CreateAchievementCompletedEvent)
export class CreateAchievementCompletedEventHandler implements IEventHandler<CreateAchievementCompletedEvent> {

    private readonly achievementQrySvcUrl: string;
    private readonly achievementQrySaveRoute: string;

    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService,
        private readonly httpService: HttpService) {

        this.logPolicy.trace('Init CreateAchievementCommandHandler', 'Init');

        this.achievementQrySvcUrl = this.configPolicy.get('ACHIEVEMENT_QRY_SERVICE_URL');
        this.achievementQrySaveRoute = this.configPolicy.get('ACHIEVEMENT_QRY_SAVE_COMPLETED_ROUTE');
    }

    handle(event: CreateAchievementCompletedEvent) {
        this.logPolicy.trace('Call CreateAchievementCompletedEventHandler:handle', 'Call');

        this.httpService
            .post(`${this.achievementQrySvcUrl}/${this.achievementQrySaveRoute}`, event.entity)
            .subscribe(
                (response) => {
                    this.logPolicy.trace('Call AchievementQry Service: Success', 'Success');
                    this.logPolicy.debug('Status Code: ' + response.status);
                    this.logPolicy.debug('Status Test: ' + response.statusText);
                    this.logPolicy.debug(JSON.stringify(response.data, null, 2));
                },
                (error) => {
                    this.logPolicy.trace('Call AchievementQry Service: Error', 'Error');
                    this.logPolicy.debug(JSON.stringify(error, null, 2));
                },
                () => {
                    this.logPolicy.trace('Call AchievementQry Service: Completed', 'Completed');
                }
            );

    }

}
