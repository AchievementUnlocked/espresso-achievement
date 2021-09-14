import { Body, Controller, Get, HttpCode, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';

import {  ObjectToEnityPipe,  } from 'cmd/acl/helpers/object-to-entity.pipe';

@Controller('user/acl')
export class UserAclController{


    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService) {

        this.logPolicy.trace('Init UserAclController', 'Init');
    }

    @UsePipes(new ObjectToEnityPipe(), new ValidationPipe({ transform: true }))
    @MessagePattern('save_registered_user')
    async saveRegisteredUser(@Body() entity: any) {

        this.logPolicy.trace('Call UserAclController.saveRegisteredUser', 'Call');
        try {


        } catch (error) {
            // TODO: Log command before handling the error and returning a response
        }
    }
}
