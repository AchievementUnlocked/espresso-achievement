import { Prop } from '@nestjs/mongoose';

import { SkillSummaryDto, UserProfileSummaryDto, AchievementMediaSummaryDto } from 'domain/schemas';

export class AchievementSummaryDto {

    @Prop()
    key: string;

    @Prop()
    title: string;

    @Prop()
    completedDate: Date;

    @Prop([SkillSummaryDto])
    skills: SkillSummaryDto[];

    @Prop([AchievementMediaSummaryDto])
    media: AchievementMediaSummaryDto[];

    @Prop({type: typeof UserProfileSummaryDto})
    userProfile: UserProfileSummaryDto;

    static getProjectedProps(): string[] {

        const props = ['key', 'title', 'completedDate']
            .concat(AchievementMediaSummaryDto.getProjectedProps().map((val) => {
                return 'media.' + val;
            }))
            .concat(SkillSummaryDto.getProjectedProps().map((val) => {
                return 'skills.' + val;
            }))
            .concat(UserProfileSummaryDto.getProjectedProps().map((val) => {
                return 'userProfile.' + val;
            }));

        return props;
    }

}
