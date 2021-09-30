import { HandlerResponse } from './handler-response';


describe('Handler Response', () => {

    describe('Constructor', () => {

        // TEST: When valid data is provides, and no error is provided
        // TEST: Then the handler response will be set to success and contain the provided data
        it('Should be success when data is valid and no error is provided', () => {

            const data: any = { name: 'testUser' };

            const response = new HandlerResponse(data, null, null);

            expect(response).toBeDefined();
            expect(response.data).toBe(data);
            expect(response.isSuccess).toBeTruthy();

        });


        // TEST: When valid or no data is provides, and and error is provided
        // TEST: Then the handler response will be set to fail and contain the provided error and input
        it('Should be fail when data is valid and error is provided', () => {

            const error: Error = new TypeError('This is an invalid type');
            const input: any = { type: 'invalid' };

            const response = new HandlerResponse(null, error, input);

            expect(response).toBeDefined();
            expect(response.error).toBe(error);
            expect(response.input).toBe(input);
            expect(response.isSuccess).toBeFalsy();

        });

    });

});