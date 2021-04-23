import { Entity } from '../entities';

export class AchievementMedia extends Entity {

    mediaPath: string;
    originalName: string;
    mimeType: string;
    size: number;
    encoding: string;
    buffer: Buffer;

    constructor(key: string) {
        super(key);
    }

    clearBuffer(): void {
        this.buffer = null;
    }
}
