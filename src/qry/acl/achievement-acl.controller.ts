import { Body, Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';

import { AchievementCreatedEvent } from 'domain/events';
import { KafkaToEventPipe } from './helpers/kafka-to-event.pipe';
import { CommonController, ControlerErrors } from 'qry/api';


@Controller('achievement/acl')
export class AchievementAclController extends CommonController {

    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService,
        private readonly eventBus: EventBus,) {

        super();

        this.logPolicy.trace('Init AchievementAclController', 'Init');
    }


    @UsePipes(new KafkaToEventPipe<any, AchievementCreatedEvent>(), new ValidationPipe({ transform: true }))
    @MessagePattern('achievement-created')
    async handleAchievementCreated(
        @Payload() event: AchievementCreatedEvent, 
        @Ctx() context: KafkaContext) {

        this.logPolicy.trace('Call AchievementAclController.handleAchievementCreated', 'Call');
        try {
            
            this.eventBus.publish(event);

        } catch (error) {
            // TODO: Log command before handling the error and returning a response

            this.handleError(error, ControlerErrors.HandleCreateAchievementError);
        }
    }

}
