import { Body, Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';

import { AchievementLikeAddedEvent } from 'domain/events';
import { KafkaToEventPipe } from './helpers/kafka-to-event.pipe';
import { CommonController, ControlerErrors } from 'cmd/api';


@Controller('achievement/acl')
export class AchievementAclController extends CommonController {

    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService,
        private readonly eventBus: EventBus,) {

        super();

        this.logPolicy.trace('Init AchievementAclController', 'Init');
    }

}
