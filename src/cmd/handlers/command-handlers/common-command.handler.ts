import { Entity } from 'domain/entities';

export abstract class CommonCommandHandler {

    constructor() {
        
    }
    
    /*
     * @description Executes the command by transformin it to a new domain entity, persisting it and raising a completed event
     * @abstract
     * @param {*} command
     * @memberof CommonCommandHandler
     */
    abstract mapToEntity(command: any): Promise<Entity>;

    /*
     * @description Executes th command by retrieiving the domain entity, merging the domain with the new command information and persisting it, 
     *              raising a completed event at the end.
     * @abstract
     * @param {*} command
     * @param {*} entity
     * @memberof CommonCommandHandler
     */
    abstract mergeToEntity(command: any, entity: Entity): Promise<Entity>;
}
