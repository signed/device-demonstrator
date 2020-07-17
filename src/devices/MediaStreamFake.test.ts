import { MediaStreamFake } from './MediaStreamFake';

describe('MediaStreamFake', () => {
    test('create a new one', () => {
        expect( new MediaStreamFake()).toBeDefined()
    });
});
