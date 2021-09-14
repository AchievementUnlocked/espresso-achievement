import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ObjectToEnityPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value.data;
  }
}
