import { Prop } from '@nestjs/mongoose';
export class UserProfileSummaryDto {

    @Prop()
    key: string;

    @Prop()
    userName: string;

    static getProjectedProps(): string[] {
        const props = ['key', 'userName'];

        return props;
    }
}
