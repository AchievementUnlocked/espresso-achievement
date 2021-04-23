import { Entity } from '../entities';

export class Skill extends Entity {

    readonly name: string;
    readonly abreviation: string;
    readonly description: string;

    constructor(id: string, name: string, abreviation: string) {
        super(id);
        this.key = id;
        this.name = name;
        this.abreviation = abreviation;
    }
}
