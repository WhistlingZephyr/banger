import {describe, it} from 'vitest';
import type {TestRunner} from '../utils/tester';

export default function customBangs(runTester: TestRunner): void {
    describe('Custom bangs', () => {
        it('should resolve custom bangs', async () => {
            await runTester('!banger', [
                'url',
                'https://github.com/WhistlingZephyr/banger',
            ]);
            await runTester('!banger test', [
                'url',
                'https://github.com/WhistlingZephyr/banger',
            ]);
            await runTester('!bang', ['url', 'https://duckduckgo.com/bangs']);
            await runTester('!bang test', [
                'url',
                'https://duckduckgo.com/bangs?q=test',
            ]);
        });
    });
}
