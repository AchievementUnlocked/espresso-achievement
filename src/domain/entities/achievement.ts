import moment from 'moment';
import { AggregateRoot } from '@nestjs/cqrs';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Entity, Aggregate, Skill, AchievementVisibility, AchievementMedia, UserProfile, LikeAction } from 'domain/entities';

import { CodeGeneratorUtil, MimeTypeUtil } from 'domain/utils';
import { AchievementCreatedEvent, AchievementContentUpdatedEvent, AchievementSkillsUpdatedEvent, AchievementLikeAddedEvent } from 'domain/events';
import { AppException, AppExceptionReason } from 'operational/exception';


export type AchievementDocument = Achievement & Entity & Document;

@Schema({ collection: 'Achievement' })
export class Achievement extends AggregateRoot {

    @Prop()
    key: string;

    @Prop()
    timestamp: Date;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    completedDate: Date;

    @Prop([Skill])
    skills: Skill[];

    @Prop()
    visibility: AchievementVisibility;

    @Prop([AchievementMedia])
    media: AchievementMedia[];

    @Prop([LikeAction])
    likes: LikeAction[];

    @Prop()
    userProfile: UserProfile;

    @Prop()
    createdBy: string;

    @Prop()
    updatedBy: string;

    constructor(key: string = null, title: string = null, description: string = null, completedDate: Date = null, visibility: number = null,
        userProfile: UserProfile = null, skills: Skill[] = null, media: AchievementMedia[] = null) {
        super();

        this.timestamp = moment().utc().toDate();

        this.key = key || CodeGeneratorUtil.GenerateShortCode();

        this.title = title;
        this.description = description;
        this.completedDate = completedDate;
        this.visibility = visibility > 0 ? visibility : AchievementVisibility.Private;

        this.likes = new Array<LikeAction>();

        this.setUserProfile(userProfile, false);
        this.setSkills(skills, false);
        this.setMedia(media, false);

        // register a created event only if content was provided
        // Otherwise, this initialization is not a propper creation
        if (title && completedDate && userProfile) {
            this.apply(
                new AchievementCreatedEvent(
                    this.key, this.title, this.description, this.completedDate, this.visibility, this.userProfile.userName,
                    this.skills.map((val) => { return val.key }),
                    this.media.map((val) => { return { mediaPath: val.mediaPath, originalName: val.originalName, size: val.size, mimeType: val.mimeType } })
                ));
        }
    }

    public setUserProfile(userProfile: UserProfile, raiseEvent: boolean = true) {
        this.userProfile = userProfile;

        if (raiseEvent) {
            // TODO: Raise AchievementUserChanged event
            // Will not set until it;s needed

        }
    }

    public setSkills(skills: Skill[], raiseEvent: boolean = true) {
        this.skills = skills;

        if (raiseEvent) {
            // TODO: Raise AchievementSkillsChanged event
            // Will not set until it;s needed
        }
    }

    public setMedia(media: AchievementMedia[], raiseEvent: boolean = true) {
        // this.mediaPath = `${entity.key}/${this.key}.${extension}`;
        this.media = media;

        // Update the media path for each media object so that the base of the path matched the achievement key
        if (this.media) {
            this.media.forEach((val, idx) => {
                val.mediaPath = `${this.key}/${val.mediaPath}`;
            });
        }

        if (raiseEvent) {
            // TODO: Raise AchievementMediaChanged event
            // Will not set until it;s needed
        }
    }

    public updateContent(title: string, description: string, completedDate: Date, visibility: number, skills: Skill[])
        : void {

        this.timestamp = moment().utc().toDate();

        // TODO: REFACTOR: Check if the value changed first so that we can prevent unnecessary change events
        this.title = title || this.title;
        this.description = description || this.description;
        this.completedDate = completedDate || this.completedDate;
        this.visibility = visibility || this.visibility;

        // TODO: REFACTOR: Check if the value changed first so that we can prevent unnecessary change events
        this.skills = skills || this.skills;


        this.apply(
            new AchievementContentUpdatedEvent(
                this.key, title, description, completedDate, visibility, this.userProfile.userName,
                skills.map((val) => { return val.key }))
        );


        this.apply(
            new AchievementSkillsUpdatedEvent(
                this.key, this.userProfile.userName,
                skills.map((val) => { return val.key }))
        );

    }

    public addLike(userName: string, likeCount: number)
        : LikeAction {

        /*
         [Domain Rule]
         Before adding the like action to the achievement, we need to make sure that 
         the user is not taking the action more than once
        */

        // TODO: [REWORK] Check that the username didn't already provide a like action
        //if (this.likes.findIndex(e => e.userName == userName) == -1) {

        const likeAction = new LikeAction(this.key, userName, likeCount);

        this.likes.push(likeAction);

        this.apply(
            new AchievementLikeAddedEvent(this.key, userName, likeCount)
        );

        return likeAction;

        // }
        //else {
        //    throw new AppException(`A like action for user ${userName} already exists`, AppExceptionReason.Validation);
        //}
    }


}

export const AchievementSchema = SchemaFactory
    .createForClass(Achievement)
    .index({ key: 1 }, { unique: true });