export class AUError extends Error {

    constructor(message: string) {
        super(message)
        this.name = 'AUError';
    }

}
