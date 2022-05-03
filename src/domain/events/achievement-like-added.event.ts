import { IEvent } from '@nestjs/cqrs';
import { CommonEvent } from '.';

export class AchievementLikeAddedEvent
    extends CommonEvent
    implements IEvent {

    constructor(
        readonly achievementKey: string,
        readonly userName: string,
        readonly likeCount: number) {
        super();
    }

}
