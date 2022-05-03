export { CommonCommandHandler } from './common-command.handler';
import { CreateAchievementCommandHandler } from './create-achievement-command.handler';
import { UpdateAchievementContentCommandHandler } from './update-achievement-content-command.handler';
import{LikeAchievementCommandHandler} from './like-achievement-command.handler';

export { HandlerResponse } from './handler-response';

export const CommandHandlers = [
    CreateAchievementCommandHandler, 
    UpdateAchievementContentCommandHandler,
    LikeAchievementCommandHandler
];
