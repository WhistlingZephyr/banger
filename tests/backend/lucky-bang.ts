import {describe, it} from 'vitest';
import type {TestRunner} from '../utils/tester';

export default function luckyBang(runTester: TestRunner): void {
    describe('Lucky bang', () => {
        it('should resolve lucky search', async () => {
            await runTester('! google', [
                'url',
                'https://duckduckgo.com/?q=!+google',
            ]);
        });
        it('should resolve invalids', async () => {
            await runTester('!', ['search', '!']);
            await runTester('! ', ['search', '! ']);
        });
    });
}
