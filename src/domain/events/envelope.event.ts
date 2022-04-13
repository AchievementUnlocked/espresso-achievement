
export class EnvelopeEvent {

    readonly key: string;
    readonly headers: any;
    readonly value: any;

    constructor(key: string, headers: any, value: any) {
        this.key = key;
        this.headers = headers;
        this.value = value;
    }
}
