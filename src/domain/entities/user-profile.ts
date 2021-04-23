import { Entity } from '../entities';

export class UserProfile extends Entity {

    userName: string;

    firstName: string;

    lastName: string;

    email: string;

    constructor(id: string) {
        super(id);
    }
}
