import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';

import { AchievementLikeAddedEvent, EnvelopeEvent } from 'domain/events';
import { ClientKafka } from '@nestjs/microservices';

@EventsHandler(AchievementLikeAddedEvent)
export class AchievementLikeAddedEventHandler implements IEventHandler<AchievementLikeAddedEvent> {

    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService,
        @Inject('kafka-cmd-client') private readonly clientKafka: ClientKafka
    ) {  
        this.logPolicy.trace('Init AchievementLikeAddedEventHandler', 'Init');
    }

    handle(event: AchievementLikeAddedEvent) {
        this.logPolicy.trace('Call AchievementLikeAddedEventHandler:handle', 'Call');

        const envelope = new EnvelopeEvent(
            
            event.key,
            {
                producer: 'achievement-cmd',
            },
            JSON.stringify(event)
        );

        this.clientKafka.emit('achievement-like-added', envelope).subscribe({
            next: (response) => {
                this.logPolicy.info('Client Kafka Subscribe Next: ' + JSON.stringify(response));
            },
            error: (error) => {
                this.logPolicy.error('Client Kafka Subscribe Error: ' + error);
            }
        });
    }

}
