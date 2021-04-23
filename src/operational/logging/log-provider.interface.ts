import { LogCategory } from '.';

export interface LogProvider {
    writeLog(message: string, category: LogCategory): void;
}
