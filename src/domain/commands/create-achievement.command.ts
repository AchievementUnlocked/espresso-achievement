import { ICommand } from '@nestjs/cqrs';

import { IsString, IsNotEmpty, Length, IsArray, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

import { CommonCommand, CreateAchievementMediaCommand } from '../commands';

import { Constants } from './constants.resource';
import { PropertyErrors } from './messages.resource';

enum AchievementVisibilityEnum {
    Private = 1,
    Friends = 2,
    Everyone = 3,
}

export class CreateAchievementCommand extends CommonCommand implements ICommand {

    // @ApiModelProperty()
    @IsString({ message: PropertyErrors.IsNotString })
    @IsNotEmpty({ message: PropertyErrors.IsEmpty })
    @Length(1, Constants.TITLE_MAX_LENGTH, { message: PropertyErrors.IsMaxLength })
    title: string;

    // @ApiModelProperty()
    @IsString({ message: PropertyErrors.IsNotString })
    @IsNotEmpty({ message: PropertyErrors.IsEmpty })
    @Length(1, Constants.DESCRIPTION_MAX_LENGTH, { message: PropertyErrors.IsMaxLength })
    description: string;

    // @ApiModelProperty({ type: Date })
    @Type(() => Date)
    @IsDate({ message: PropertyErrors.IsNotDate })
    completedDate: Date;

    // @ApiModelProperty({ type: [String] })
    @IsArray({ message: PropertyErrors.IsNotArray })
    skills?: string[];

    // @ApiModelProperty({ type: AchievementVisibilityEnum })
    @IsEnum(AchievementVisibilityEnum, { message: PropertyErrors.IsNotValidEnum })
    visibility?: AchievementVisibilityEnum;

    media?: CreateAchievementMediaCommand[];

    // @ApiModelProperty()
    @IsString({ message: PropertyErrors.IsNotString })
    @IsNotEmpty({ message: PropertyErrors.IsEmpty })
    @Length(1, Constants.USERNAME_MAX_LENGTH, { message: PropertyErrors.IsMaxLength })
    userName: string;

    constructor() {
        super();
    }
}
