import fastCartesian from 'fast-cartesian';
import {describe, it} from 'vitest';
import type {TestRunner} from '../utils/tester';

export default function siteBangs(runTester: TestRunner): void {
    describe('Site bangs', () => {
        it('should resolve domain', async () => {
            await runTester('!@g', ['search', 'site:https://www.google.com/']);
            await runTester('!@mdn', [
                'search',
                'site:https://developer.mozilla.org/',
            ]);
        });
        it('should resolve query', async () => {
            await runTester('!@g test', [
                'search',
                'site:https://www.google.com/ test',
            ]);
            await runTester('!@mdn test', [
                'search',
                'site:https://developer.mozilla.org/ test',
            ]);
        });
        it('should resolve multiple domains', async () => {
            await runTester(
                '!@g;mdn',
                ['search', 'site:https://www.google.com/'],
                ['search', 'site:https://developer.mozilla.org/'],
            );
        });
        it('should resolve multiple queries', async () => {
            await runTester(
                '!@g;mdn test',
                ['search', 'site:https://www.google.com/ test'],
                ['search', 'site:https://developer.mozilla.org/ test'],
            );
        });
        it('should resolve multiple site domains', async () => {
            await runTester('!@g,mdn', [
                'search',
                'site:https://www.google.com/ OR site:https://developer.mozilla.org/',
            ]);
        });
        it('should resolve multiple site queries', async () => {
            await runTester('!@g,mdn test', [
                'search',
                'site:https://www.google.com/ OR site:https://developer.mozilla.org/ test',
            ]);
        });
        it('should resolve mixed site domains', async () => {
            await runTester(
                '!@g,mdn;g;mdn',
                [
                    'search',
                    'site:https://www.google.com/ OR site:https://developer.mozilla.org/',
                ],
                ['search', 'site:https://www.google.com/'],
                ['search', 'site:https://developer.mozilla.org/'],
            );
        });
        it('should resolve mixed site queries', async () => {
            await runTester(
                '!@g,mdn;g;mdn test',
                [
                    'search',
                    'site:https://www.google.com/ OR site:https://developer.mozilla.org/ test',
                ],
                ['search', 'site:https://www.google.com/ test'],
                ['search', 'site:https://developer.mozilla.org/ test'],
            );
        });
        it('should resolve invalids', async () => {
            await runTester('!@abcd', ['search', '!@abcd']);
            await runTester('!@abcd test', ['search', '!@abcd test']);
            await runTester(
                '!@abcd;efgh',
                ['search', '!@abcd;efgh'],
                ['search', '!@abcd;efgh'],
            );
            await runTester(
                '!@abcd;efgh test',
                ['search', '!@abcd;efgh test'],
                ['search', '!@abcd;efgh test'],
            );
            await runTester('!@abcd,efgh', ['search', '!@abcd,efgh']);
            await runTester('!@abcd,efgh test', ['search', '!@abcd,efgh test']);
            await runTester(
                '!@abcd,efgh;ijkl',
                ['search', '!@abcd,efgh;ijkl'],
                ['search', '!@abcd,efgh;ijkl'],
            );
            await runTester(
                '!@abcd,efgh;ijkl test',
                ['search', '!@abcd,efgh;ijkl test'],
                ['search', '!@abcd,efgh;ijkl test'],
            );
            await runTester('!@', ['search', '!@']);
            await runTester('!@ ', ['search', '!@ ']);
            await runTester('!@;', ['search', '!@;'], ['search', '!@;']);
            await runTester('!@,;', ['search', '!@,;'], ['search', '!@,;']);
            await runTester('!@g,', ['search', 'site:https://www.google.com/']);
            await runTester('!@g, test', [
                'search',
                'site:https://www.google.com/ test',
            ]);
            const queries = fastCartesian(
                ['!@', 'g', ';', 'mdn'].flatMap(segment => [
                    [segment],
                    ['', ','],
                ]),
            )
                .slice(1)
                .map(item => item.join(''));
            await Promise.all(
                queries.flatMap(async query => [
                    runTester(
                        query,
                        ['search', 'site:https://www.google.com/'],
                        ['search', 'site:https://developer.mozilla.org/'],
                    ),
                    runTester(
                        query + ' test',
                        ['search', 'site:https://www.google.com/ test'],
                        ['search', 'site:https://developer.mozilla.org/ test'],
                    ),
                ]),
            );
            await Promise.all(
                ['!@g,mdn,', '!@,g,mdn', '!@,g,mdn,'].flatMap(async query => [
                    runTester(query, [
                        'search',
                        'site:https://www.google.com/ OR site:https://developer.mozilla.org/',
                    ]),
                    runTester(query + ' test', [
                        'search',
                        'site:https://www.google.com/ OR site:https://developer.mozilla.org/ test',
                    ]),
                ]),
            );
        });
    });
}
