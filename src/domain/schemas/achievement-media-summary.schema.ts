import { Prop } from '@nestjs/mongoose';

export class AchievementMediaSummaryDto {

    @Prop()
    mediaPath: string;

    @Prop()
    originalName: string;

    static getProjectedProps(): string[] {
        const props = ['mediaPath', 'originalName'];

        return props;
    }
}
