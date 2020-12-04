import { strictEqual } from 'assert';
import { describe, it } from 'mocha';
import Application from '../src/app';

const app = new Application();
app.listen(5001);

describe('Util.isAsyncFn', () => {
    it('should return 1', () => {
        app.listen();
        strictEqual(1, 1);
    });
});
