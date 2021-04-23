import { Injectable, LoggerService } from '@nestjs/common';

import { ConfigPolicyService } from '../configuration';

import { LogProvider, LogCategory , ConsoleLogProvider} from '.';

@Injectable()
export class LogPolicyService implements LoggerService {

    readonly logProvider: LogProvider;
    readonly logLevel: number;

    constructor(
        private readonly configPolicy: ConfigPolicyService) {
        this.logProvider = new ConsoleLogProvider();

        const parsedLevel = parseInt(this.configPolicy.get('LOG_DETAIL'), 10);

        this.logLevel = isNaN(parsedLevel) ? 5 : parsedLevel;
    }

    log(message: any, context?: string) {
        throw new Error('Method not implemented.');
    }

    debug(message: any, context?: string) {
        this.logLevel >= 5 && this.logProvider.writeLog(message, LogCategory.Debug);
    }

    verbose(message: any, context?: string) {
        this.logLevel >= 4 && this.logProvider.writeLog(message, LogCategory.Verbose);
    }

    trace(message: any, context?: string) {
        this.logLevel >= 3 && this.logProvider.writeLog(message, LogCategory.Trace);
    }

    info(message: any, context?: string) {
        this.logLevel >= 2 && this.logProvider.writeLog(message, LogCategory.Info);
    }

    warn(message: any, context?: string) {
        this.logLevel >= 1 && this.logProvider.writeLog(message, LogCategory.Warning);
    }

    error(message: any, trace?: string, context?: string) {
        this.logLevel >= 0 && this.logProvider.writeLog(message, LogCategory.Error);

    }
}
