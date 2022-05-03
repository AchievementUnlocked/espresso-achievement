import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class KafkaToEventPipe<T, R> implements PipeTransform<T, R> {
  transform(input: any, metadata: ArgumentMetadata): R {

    // We need to leave the KafkaContext intact, we only need to extract the value from the Payload input message
    if(input.constructor.name === 'KafkaContext'){
      return input;
    }
    else{
      return input.value as R;
    }
  }
}
