import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';

import { AchievementCreatedEvent, EnvelopeEvent } from 'domain/events';
import { ClientKafka } from '@nestjs/microservices';

@EventsHandler(AchievementCreatedEvent)
export class AchievementCreatedEventHandler implements IEventHandler<AchievementCreatedEvent> {

    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService,
        @Inject('kafka-client') private readonly clientKafka: ClientKafka
    ) {
        this.logPolicy.trace('Init AchievementCreatedEventHandler', 'Init');
    }

    handle(event: AchievementCreatedEvent) {
        this.logPolicy.trace('Call AchievementCreatedEventHandler:handle', 'Call');

        const envelope = new EnvelopeEvent(
            
            event.key,
            {
                producer: 'achievement-cmd',
            },
            JSON.stringify(event)
        );

        this.clientKafka.emit('achievement-created', envelope).subscribe({
            next: (response) => {
                this.logPolicy.info('Client Kafka Subscribe Next: ' + JSON.stringify(response));
            },
            error: (error) => {
                this.logPolicy.error('Client Kafka Subscribe Error: ' + error);
            }
        });
    }

}
