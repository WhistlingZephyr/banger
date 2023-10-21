import {describe, it} from 'vitest';
import type {TestRunner} from '../utils/tester';

export default function bangs(runTester: TestRunner): void {
    describe('Bangs', () => {
        it('should resolve domain', async () => {
            await runTester('!g', ['url', 'https://www.google.com/']);
            await runTester('!mdn', ['url', 'https://developer.mozilla.org/']);
        });
        it('should resolve query', async () => {
            await runTester('!g test', [
                'url',
                'https://www.google.com/search?q=test',
            ]);
            await runTester('!mdn test', [
                'url',
                'https://developer.mozilla.org/search?q=test',
            ]);
        });
        it('should resolve case insensitively', async () => {
            await runTester('!G', ['url', 'https://www.google.com/']);
            await runTester('!G test', [
                'url',
                'https://www.google.com/search?q=test',
            ]);
        });
        it('should resolve multiple domains', async () => {
            await runTester(
                '!g;mdn',
                ['url', 'https://www.google.com/'],
                ['url', 'https://developer.mozilla.org/'],
            );
        });
        it('should resolve multiple queries', async () => {
            await runTester(
                '!g;mdn test',
                ['url', 'https://www.google.com/search?q=test'],
                ['url', 'https://developer.mozilla.org/search?q=test'],
            );
        });
        it('should resolve invalids', async () => {
            await runTester('!;', ['search', '!;'], ['search', '!;']);
            await runTester('!; ', ['search', '!; '], ['search', '!; ']);
            await runTester(
                '!;;',
                ['search', '!;;'],
                ['search', '!;;'],
                ['search', '!;;'],
            );
            await runTester('!abcd', ['search', '!abcd']);
            await runTester('!abcd test', ['search', '!abcd test']);
            await runTester(
                '!abcd;efgh',
                ['search', '!abcd;efgh'],
                ['search', '!abcd;efgh'],
            );
            await runTester(
                '!abcd;efgh test',
                ['search', '!abcd;efgh test'],
                ['search', '!abcd;efgh test'],
            );
            await runTester(
                '!g;mdn;abcd',
                ['url', 'https://www.google.com/'],
                ['url', 'https://developer.mozilla.org/'],
                ['search', '!g;mdn;abcd'],
            );
            await runTester(
                '!g;mdn;abcd test',
                ['url', 'https://www.google.com/search?q=test'],
                ['url', 'https://developer.mozilla.org/search?q=test'],
                ['search', '!g;mdn;abcd test'],
            );
            await runTester(
                '!g;',
                ['url', 'https://www.google.com/'],
                ['search', '!g;'],
            );
            await runTester(
                '!g; test',
                ['url', 'https://www.google.com/search?q=test'],
                ['search', '!g; test'],
            );
        });
    });
}
