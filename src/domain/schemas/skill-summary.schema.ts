import { Prop } from '@nestjs/mongoose';

export class SkillSummaryDto {

    @Prop()
    abreviation: string;

    static getProjectedProps(): string[] {
        const props = ['abreviation'];

        return props;
    }
}
