import { IsString, IsNotEmpty, Length, IsInt} from 'class-validator';

import { Constants } from './constants.resource';
import { PropertyErrors } from './messages.resource';

export class CreateAchievementMediaCommand {

    /*
            buffer:Buffer(50840)
            [255, 216, 255, 224, 0, 16, 74, 70, 73, 70, 0, 1, 1, 1, 0, 53, 0, 53, 0, 0, 255, 219, 0, 67, 0, 5, 3, 4, 4,
                    4, 3, 5, 4, 4, 4, 5, 5, 5, 6, 7, 12, 8, 7, 7, 7, 7, 15, 11, 11, 9, 12, 17, 15, 18, 18, 17, 15, 17, 17,
                    19, 22, 28, 23, 19, 20, 26, 21, 17, 17, 24, 33, 24, 26, 29, 29, 31, 31, 31, 19, 23, 34, 36, 34, 30, 36,
                    28, 30, 31, 30, 255, 219, 0, 67, 1, 5, 5, 5, 7, 6, 7, …]
            encoding:'7bit'
            fieldname:'file'
            mimetype:'image/jpeg'
            originalname:'tvfyz-4JILwC.jpeg'
            size:50840
    */

    readonly buffer: Buffer;

    @IsString({ message: PropertyErrors.IsNotString })
    @IsNotEmpty({ message: PropertyErrors.IsEmpty })
    @Length(1, Constants.MIME_MAX_LENGTH, { message: PropertyErrors.IsMaxLength })
    readonly mimeType: string;

    @IsString({ message: PropertyErrors.IsNotString })
    @IsNotEmpty({ message: PropertyErrors.IsEmpty })
    @Length(1, Constants.FILENAME_MAX_LENGTH, { message: PropertyErrors.IsMaxLength })
    readonly originalName: string;

    @IsInt({ message: PropertyErrors.IsNotInt })
    readonly size: number;

    constructor(buffer: Buffer, mimetype: string, originalname: string, size: number) {
        this.buffer = buffer;
        this.mimeType = mimetype;
        this.originalName = originalname;
        this.size = size;
    }

    static fromHttpFiles(files: any[]): CreateAchievementMediaCommand[] {
        // Take each of the file metadat andd turn it into a command
        return files.map((val, idx) => {
            return new CreateAchievementMediaCommand(
                val.buffer,
                val.mimetype,
                val.originalname,
                val.size
            );
        });
    }
}
