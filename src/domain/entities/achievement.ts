import { Entity, Aggregate, Skill, AchievementVisibility, AchievementMedia, UserProfile } from '../entities';

export class Achievement extends Entity {

    title: string;

    description: string;

    completedDate: Date;

    skills: Skill[];

    visibility: AchievementVisibility;

    media: AchievementMedia[];

    userProfile: UserProfile;

    constructor(key: string) {
        super(key);
    }
}
