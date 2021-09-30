import { ICommand } from '@nestjs/cqrs';

import { IsString, IsNotEmpty, Length, IsArray, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

import { CommonCommand } from '.';

import { Constants } from './constants.resource';
import { PropertyErrors } from './messages.resource';

enum AchievementVisibilityEnum {
    Private = 1,
    Friends = 2,
    Everyone = 3,
}

export class UpdateAchievementContentCommand extends CommonCommand implements ICommand {

    @IsString({ message: PropertyErrors.IsNotString })
    @IsNotEmpty({ message: PropertyErrors.IsEmpty })
    key: string;

    title?: string;
    description?: string;
    completedDate?: Date;
    skills?: string[];
    visibility?: number;
    userName?: string;

    constructor() {
        super();
    }
}
