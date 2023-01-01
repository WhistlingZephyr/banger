import {describe, it} from 'vitest';
import type {TestRunner} from '../utils/tester';

export default function relativeBangs(runTester: TestRunner): void {
    describe('Relative bangs', () => {
        it('should resolve relative bangs', async () => {
            await runTester('!xkcd test', [
                'url',
                'https://duckduckgo.com/?q=test+site:xkcd.com',
            ]);
        });
    });
}
