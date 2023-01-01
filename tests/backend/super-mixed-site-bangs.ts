import {describe, it} from 'vitest';
import type {TestRunner} from '../utils/tester';

export default function superMixedSiteBangs(runTester: TestRunner): void {
    describe('Mixed site bangs', () => {
        it('should resolve if the first site is unspecified', async () => {
            await runTester(
                '!@r;g@r',
                ['search', 'site:https://www.reddit.com/'],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/'),
                ],
            );
            await runTester(
                '!@r;g@r,g',
                ['search', 'site:https://www.reddit.com/'],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/',
                        ),
                ],
            );
            await runTester(
                '!@r,g;g@r',
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/',
                ],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/'),
                ],
            );
            await runTester(
                '!@r,g;g@r,g',
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/',
                ],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/',
                        ),
                ],
            );
            await runTester(
                '!@r;g@r test',
                ['search', 'site:https://www.reddit.com/ test'],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/ test'),
                ],
            );
            await runTester(
                '!@r;g@r,g test',
                ['search', 'site:https://www.reddit.com/ test'],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                        ),
                ],
            );
            await runTester(
                '!@r,g;g@r test',
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                ],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/ test'),
                ],
            );
            await runTester(
                '!@r,g;g@r,g test',
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                ],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                        ),
                ],
            );
        });
        it('should resolve if last site is unspecified', async () => {
            await runTester(
                '!g@r;@r',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/'),
                ],
                ['search', 'site:https://www.reddit.com/'],
            );
            await runTester(
                '!g@r;@r,g',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/'),
                ],
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/',
                ],
            );
            await runTester(
                '!g@r,g;@r',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/',
                        ),
                ],
                ['search', 'site:https://www.reddit.com/'],
            );
            await runTester(
                '!g@r,g;@r,g',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/',
                        ),
                ],
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/',
                ],
            );
            await runTester(
                '!g@r;@r test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/ test'),
                ],
                ['search', 'site:https://www.reddit.com/ test'],
            );
            await runTester(
                '!g@r;@r,g test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/ test'),
                ],
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                ],
            );
            await runTester(
                '!g@r,g;@r test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                        ),
                ],
                ['search', 'site:https://www.reddit.com/ test'],
            );
            await runTester(
                '!g@r,g;@r,g test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                        ),
                ],
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                ],
            );
        });
        it('should resolve if middle site is unspecified', async () => {
            await runTester(
                '!g@r;@r;mdn',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/'),
                ],
                ['search', 'site:https://www.reddit.com/'],
                ['url', 'https://developer.mozilla.org/'],
            );
            await runTester(
                '!g@r;@r,g;mdn',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/'),
                ],
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/',
                ],
                ['url', 'https://developer.mozilla.org/'],
            );
            await runTester(
                '!g@r,g;@r;mdn',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/',
                        ),
                ],
                ['search', 'site:https://www.reddit.com/'],
                ['url', 'https://developer.mozilla.org/'],
            );
            await runTester(
                '!g@r,g;@r,g;mdn',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/',
                        ),
                ],
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/',
                ],
                ['url', 'https://developer.mozilla.org/'],
            );
            await runTester(
                '!g@r;@r;mdn test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/ test'),
                ],
                ['search', 'site:https://www.reddit.com/ test'],
                ['url', 'https://developer.mozilla.org/search?q=test'],
            );
            await runTester(
                '!g@r;@r,g;mdn test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/ test'),
                ],
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                ],
                ['url', 'https://developer.mozilla.org/search?q=test'],
            );
            await runTester(
                '!g@r,g;@r;mdn test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                        ),
                ],
                ['search', 'site:https://www.reddit.com/ test'],
                ['url', 'https://developer.mozilla.org/search?q=test'],
            );
            await runTester(
                '!g@r,g;@r,g;mdn test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                        ),
                ],
                [
                    'search',
                    'site:https://www.reddit.com/ | site:https://www.google.com/ test',
                ],
                ['url', 'https://developer.mozilla.org/search?q=test'],
            );
        });
    });
}
