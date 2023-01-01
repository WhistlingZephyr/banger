import fastCartesian from 'fast-cartesian';
import {describe, it} from 'vitest';
import type {TestRunner} from '../utils/tester';

export default function mixedSiteBangs(runTester: TestRunner): void {
    describe('Mixed site bangs', () => {
        it('should resolve domain', async () => {
            await runTester('!g@r', [
                'url',
                'https://www.google.com/search?q=' +
                    encodeURIComponent('site:https://www.reddit.com/'),
            ]);
            await runTester('!ddg@mdn', [
                'url',
                'https://duckduckgo.com/?q=' +
                    encodeURIComponent('site:https://developer.mozilla.org/'),
            ]);
        });
        it('should resolve query', async () => {
            await runTester('!g@r test', [
                'url',
                'https://www.google.com/search?q=' +
                    encodeURIComponent('site:https://www.reddit.com/ test'),
            ]);
            await runTester('!ddg@mdn test', [
                'url',
                'https://duckduckgo.com/?q=' +
                    encodeURIComponent(
                        'site:https://developer.mozilla.org/ test',
                    ),
            ]);
        });
        it('should resolve multiple site domains', async () => {
            await runTester('!g@r,mdn', [
                'url',
                'https://www.google.com/search?q=' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ | site:https://developer.mozilla.org/',
                    ),
            ]);
            await runTester('!ddg@mdn,r', [
                'url',
                'https://duckduckgo.com/?q=' +
                    encodeURIComponent(
                        'site:https://developer.mozilla.org/ | site:https://www.reddit.com/',
                    ),
            ]);
        });
        it('should resolve multiple site queries', async () => {
            await runTester('!g@r,mdn test', [
                'url',
                'https://www.google.com/search?q=' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ | site:https://developer.mozilla.org/ test',
                    ),
            ]);
            await runTester('!ddg@mdn,r test', [
                'url',
                'https://duckduckgo.com/?q=' +
                    encodeURIComponent(
                        'site:https://developer.mozilla.org/ | site:https://www.reddit.com/ test',
                    ),
            ]);
        });
        it('should resolve multiple bang domains', async () => {
            await runTester(
                '!g@r;mdn',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/'),
                ],
                ['url', 'https://developer.mozilla.org/'],
            );
            await runTester(
                '!ddg@mdn;r',
                [
                    'url',
                    'https://duckduckgo.com/?q=' +
                        encodeURIComponent(
                            'site:https://developer.mozilla.org/',
                        ),
                ],
                ['url', 'https://www.reddit.com/'],
            );
        });
        it('should resolve multiple bang queries', async () => {
            await runTester(
                '!g@r;mdn test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/ test'),
                ],
                ['url', 'https://developer.mozilla.org/search?q=test'],
            );
            await runTester(
                '!ddg@mdn;r test',
                [
                    'url',
                    'https://duckduckgo.com/?q=' +
                        encodeURIComponent(
                            'site:https://developer.mozilla.org/ test',
                        ),
                ],
                ['url', 'https://www.reddit.com/search?q=test'],
            );
        });
        it('should resolve invalids', async () => {
            await runTester('!abcd@abcd', ['search', '!abcd@abcd']);
            await runTester('!g@abcd', ['search', '!g@abcd']);
            await runTester('!g@', ['search', '!g@']);
            await runTester('!g@,', ['search', '!g@,']);
            await runTester('!g@,,', ['search', '!g@,,']);
            const queries = fastCartesian(
                ['!g@', 'r', ';ddg@', 'mdn'].flatMap(segment => [
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
                            'https://www.google.com/search?q=' +
                                encodeURIComponent(
                                    'site:https://www.reddit.com/',
                                ),
                        ],
                        [
                            'url',
                            'https://duckduckgo.com/?q=' +
                                encodeURIComponent(
                                    'site:https://developer.mozilla.org/',
                                ),
                        ],
                    ),
                    runTester(
                        query + ' test',
                        [
                            'url',
                            'https://www.google.com/search?q=' +
                                encodeURIComponent(
                                    'site:https://www.reddit.com/ test',
                                ),
                        ],
                        [
                            'url',
                            'https://duckduckgo.com/?q=' +
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
