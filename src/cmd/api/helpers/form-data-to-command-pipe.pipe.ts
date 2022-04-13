import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FormDataToCommandPipe implements PipeTransform<any> {

  constructor(options?: any) {

  }

  transform(value: any, metadata: ArgumentMetadata) {
    /*
    this.logPolicy.trace('Call FormDataToCommandPipe.transform', 'Call');
    this.logPolicy.debug(value);
    */

    // Parse the string in 'command' to a JSON object only if the command has a value
    return value.command
      ? JSON.parse(value.command)
      : value;

  }
}
