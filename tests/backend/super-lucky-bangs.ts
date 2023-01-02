import fastCartesian from 'fast-cartesian';
import {describe, it} from 'vitest';
import type {TestRunner} from '../utils/tester';

export default function superLuckyBangs(runTester: TestRunner): void {
    describe('Super lucky bangs', () => {
        it('should resolve domain', async () => {
            await runTester('!!r', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent('site:https://www.reddit.com/'),
            ]);
            await runTester('!!mdn', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent('site:https://developer.mozilla.org/'),
            ]);
        });
        it('should resolve query', async () => {
            await runTester('!!r test', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent('site:https://www.reddit.com/ test'),
            ]);
            await runTester('!!mdn test', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent(
                        'site:https://developer.mozilla.org/ test',
                    ),
            ]);
        });
        it('should resolve multiple domains', async () => {
            await runTester(
                '!!r;mdn',
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent('site:https://www.reddit.com/'),
                ],
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent(
                            'site:https://developer.mozilla.org/',
                        ),
                ],
            );
        });
        it('should resolve multiple queries', async () => {
            await runTester(
                '!!r;mdn test',
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent('site:https://www.reddit.com/ test'),
                ],
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent(
                            'site:https://developer.mozilla.org/ test',
                        ),
                ],
            );
        });
        it('should resolve multiple site domains', async () => {
            await runTester('!!r,mdn', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ OR site:https://developer.mozilla.org/',
                    ),
            ]);
        });
        it('should resolve multiple site queries', async () => {
            await runTester('!!r,mdn test', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ OR site:https://developer.mozilla.org/ test',
                    ),
            ]);
        });
        it('should resolve mixed site domains', async () => {
            await runTester(
                '!!r,mdn;mdn',
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ OR site:https://developer.mozilla.org/',
                        ),
                ],
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent(
                            'site:https://developer.mozilla.org/',
                        ),
                ],
            );
        });
        it('should resolve mixed site queries', async () => {
            await runTester(
                '!!r,mdn;mdn test',
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ OR site:https://developer.mozilla.org/ test',
                        ),
                ],
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent(
                            'site:https://developer.mozilla.org/ test',
                        ),
                ],
            );
        });
        it('should resolve invalids', async () => {
            await runTester('!!abcd', ['search', '!!abcd']);
            await runTester('!!abcd test', ['search', '!!abcd test']);
            await runTester(
                '!!abcd;efgh',
                ['search', '!!abcd;efgh'],
                ['search', '!!abcd;efgh'],
            );
            await runTester(
                '!!abcd;efgh test',
                ['search', '!!abcd;efgh test'],
                ['search', '!!abcd;efgh test'],
            );
            await runTester('!!abcd,efgh', ['search', '!!abcd,efgh']);
            await runTester('!!abcd,efgh test', ['search', '!!abcd,efgh test']);
            await runTester(
                '!!abcd,efgh;ijkl',
                ['search', '!!abcd,efgh;ijkl'],
                ['search', '!!abcd,efgh;ijkl'],
            );
            await runTester(
                '!!abcd,efgh;ijkl test',
                ['search', '!!abcd,efgh;ijkl test'],
                ['search', '!!abcd,efgh;ijkl test'],
            );
            const queries = fastCartesian(
                ['!!', 'r', ';', 'mdn'].flatMap(segment => [
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
                        [
                            'url',
                            'https://duckduckgo.com/?q=!+' +
                                encodeURIComponent(
                                    'site:https://www.reddit.com/',
                                ),
                        ],
                        [
                            'url',
                            'https://duckduckgo.com/?q=!+' +
                                encodeURIComponent(
                                    'site:https://developer.mozilla.org/',
                                ),
                        ],
                    ),
                    runTester(
                        query + ' test',
                        [
                            'url',
                            'https://duckduckgo.com/?q=!+' +
                                encodeURIComponent(
                                    'site:https://www.reddit.com/ test',
                                ),
                        ],
                        [
                            'url',
                            'https://duckduckgo.com/?q=!+' +
                                encodeURIComponent(
                                    'site:https://developer.mozilla.org/ test',
                                ),
                        ],
                    ),
                ]),
            );
        });
    });
}
