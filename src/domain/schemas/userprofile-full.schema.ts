import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserProfile } from 'domain/entities';

export type UserProfileFullDocument = UserProfileFullDto & Document;

@Schema({ collection: 'UserProfileFull' })
export class UserProfileFullDto {

    @Prop()
    _id: string;

    @Prop()
    key: string;

    @Prop()
    userName: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    email: string;


    static fromDomain(entity: UserProfile): UserProfileFullDto {

        const dto = new UserProfileFullDto();

        dto.userName = entity.userName;
        dto.firstName = entity.firstName;
        dto.lastName = entity.lastName;
        dto.email = entity.email;

        return dto;
    }

    static toDomain(dto: UserProfileFullDto): UserProfile {
        const entity = new UserProfile(dto._id);

        entity.userName = dto.userName;
        entity.firstName = dto.firstName;
        entity.lastName = dto.lastName;
        entity.email = dto.email;

        return entity;
    }

    /*
    static fromCreateCommand(command: CreateUserProfileCommand): UserProfileFullDto {

        const dto = new UserProfileFullDto();

        dto.key = command.key;
        dto.userName = command.userName;
        dto.firstName = command.firstName;
        dto.lastName = command.lastName;
        dto.email = command.email;

        return dto;
    }
    */
}

export const UserProfileFullSchema = SchemaFactory
    .createForClass(UserProfileFullDto)
    .index({ userName: 1 }, { unique: true });
