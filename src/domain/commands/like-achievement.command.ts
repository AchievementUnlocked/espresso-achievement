import { ICommand } from '@nestjs/cqrs';

import { IsString, IsNotEmpty, Length, IsArray, IsDate, IsEnum, IsInt, isNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

import { CommonCommand, CreateAchievementMediaCommand } from '../commands';

import { Constants } from './constants.resource';
import { PropertyErrors } from './messages.resource';

export class LikeAchievementCommand extends CommonCommand implements ICommand{

    @IsString({ message: PropertyErrors.IsNotString })
    key: string;

    @IsInt({ message: PropertyErrors.IsNotInt })
    likeCount: number;
}