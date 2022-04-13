import { IEvent } from '@nestjs/cqrs';
import { CommonEvent } from '.';

export class AchievementSkillsUpdatedEvent
    extends CommonEvent
    implements IEvent {

    constructor(
        readonly achievementKey: string,
        readonly userName: string,
        readonly skills: string[]) {
        super();
    }

}
