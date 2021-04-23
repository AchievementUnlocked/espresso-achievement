
import chalk from 'chalk';

import { LogProvider, LogCategory } from '.';

export class ConsoleLogProvider implements LogProvider {

    writeLog(log: any, category: LogCategory): void {

        const message = JSON.stringify(log, null, 2);

        switch (category) {
            case LogCategory.Debug:
                console.log(chalk.white(message));
                break;
            case LogCategory.Verbose:
                console.log(chalk.blueBright(message));
                break;
            case LogCategory.Trace:
                console.log(chalk.magentaBright(message));
                break;
            case LogCategory.Info:
                console.info(chalk.cyanBright(message));
                break;
            case LogCategory.Warning:
                console.warn(chalk.yellowBright(message));
                break;
            case LogCategory.Error:
                console.error(chalk.redBright(message));
                break;
            default:
                console.log(chalk.blueBright(message));
                break;
        }
    }
}
