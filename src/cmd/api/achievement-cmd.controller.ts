// Base framework dependencies
import { Controller, Post, Put, Param, Body, HttpCode, UsePipes, ValidationPipe, UseInterceptors, UseFilters, UploadedFiles } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

// External and installed dependencies

// Operatiional, resource and utility dependencies
import { LogPolicyService, LogRequestInterceptor } from 'operational/logging';
import { AppExceptionFilter } from 'operational/exception';

// Inner application dependencies
import { Achievement } from 'domain/entities';
import { CreateAchievementCommand, CreateAchievementMediaCommand, LikeAchievementCommand, UpdateAchievementContentCommand } from 'domain/commands';
import { HandlerResponse } from 'cmd/handlers/command-handlers';

// Innermodule dependencies
import { CommonController, ControlerErrors } from 'cmd/api';
import { FormDataToCommandPipe } from 'cmd/api/helpers';


@Controller('achievement/cmd')
@UseInterceptors(LogRequestInterceptor)
@UseFilters(AppExceptionFilter)
export class AchievementCmdController extends CommonController {

    constructor(
        private readonly logPolicy: LogPolicyService,
        private readonly commandBus: CommandBus) {

        super();

        this.logPolicy.trace('Init AchievementController', 'Init');
    }

    @Post()
    @HttpCode(202)
    @UseInterceptors(FilesInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @UsePipes(new FormDataToCommandPipe(), new ValidationPipe({ transform: true }))
    async createAchievement(
        @Body() command: CreateAchievementCommand,
        @UploadedFiles() files: any[]) {

        this.logPolicy.trace('Call AchievementController.createAchievementWithFile', 'Call');

        try {
            // TODO: Need to get eh requesting user from the headers, or from the receiving command
            command.commandingUser = '123ABC'

            // Take each of the file metadat andd turn it into a command
            command.media = CreateAchievementMediaCommand.fromHttpFiles(files);

            const response = await this.commandBus.execute(command) as HandlerResponse;

            // TODO: DEBUGGING: Printing the response
            /*
            this.logPolicy.debug('RESPONSE');
            const entity = response.data as Achievement;
            this.logPolicy.debug(`${entity.key} : ${entity.title}`);
            */

            return response;
        } catch (error) {
            // TODO: Log command before handling the error and returning a response

            this.handleError(error, ControlerErrors.CreateAchievementError);
        }
    }


    @Put(':key/content')
    @HttpCode(202)
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateAchievementContent(
        @Param('key') key: string,
        @Body() command: UpdateAchievementContentCommand) {

        this.logPolicy.trace('Call AchievementController.updateAchievementContent', 'Call');

        try {
            command.key = key;

            // TODO: Need to get eh requesting user from the headers, or from the receiving command
            command.commandingUser = '123ABC'

            const response = await this.commandBus.execute(command) as HandlerResponse;

            // TODO: DEBUGGING: Printing the response
            /*
            this.logPolicy.debug('RESPONSE');
            const entity = response.data as Achievement;
            this.logPolicy.debug(`${entity.key} : ${entity.title}`);
            */

            return response;
        } catch (error) {
            // TODO: Log command before handling the error and returning a response

            this.handleError(error, ControlerErrors.CreateAchievementError);
        }
    }

    @Put(':key/like')
    @HttpCode(202)
    @UsePipes(new ValidationPipe({ transform: true }))
    async likeAchievement(
        @Param('key') key: string,
        @Body() command: LikeAchievementCommand) {

        this.logPolicy.trace('Call AchievementController.likeAchievement', 'Call');

        try {
            command.key = key;

            // TODO: Need to get eh requesting user from the headers, or from the receiving command
            // command.commandingUser = '123ABC'

            const response = await this.commandBus.execute(command) as HandlerResponse;

            // TODO: DEBUGGING: Printing the response
            /*
            this.logPolicy.debug('RESPONSE');
            const entity = response.data as Achievement;
            this.logPolicy.debug(`${entity?.key} : ${entity?.title}`);
            */

            return response;
        } catch (error) {
            // TODO: Log command before handling the error and returning a response

            this.handleError(error, ControlerErrors.AchievementLikeAddedError);
        }

    }

}
