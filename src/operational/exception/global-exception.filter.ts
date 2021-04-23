import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import chalk from 'chalk';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {

    console.log(chalk.redBright('GLOBAL EXCEPTION FILTER'));

    console.log(chalk.redBright(JSON.stringify(exception, null, 2)));
  }
}
