import { IEvent } from '@nestjs/cqrs';
import { CommonEvent } from '.';

export class AchievementContentUpdatedEvent 
extends CommonEvent
implements IEvent {

constructor(
    readonly achievementKey: string,
    readonly title: string,
    readonly description: string,
    readonly completedDate: Date,
    readonly visibility: number,
    readonly userName: string,
    readonly skills: string[]) {
    super();
}

}
