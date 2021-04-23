import { Achievement } from 'domain/entities';
import { CommonEvent } from '../events';

export class CreateAchievementCompletedEvent extends CommonEvent {

    readonly entity: Achievement;

    constructor(entity: Achievement) {
        super();

        this.entity = entity;
    }

}
