import {describe, expect, it} from 'vitest';
import type {TestRunner} from '../utils/tester';
import {bangConfig} from '@/helpers/bang';

export default function configUpdates(runTester: TestRunner): void {
    describe('Config updates', () => {
        it('should update bang prefix', async () => {
            await expect(bangConfig.bangPrefix.updateValue('#')).resolves.toBe(
                true,
            );
            await runTester('#g', ['url', 'https://www.google.com/']);
            await runTester('#g test', [
                'url',
                'https://www.google.com/search?q=test',
            ]);
            await runTester('!g', ['search', '!g']);
            await runTester('!g test', ['search', '!g test']);
        });
        it('should update lucky bang url', async () => {
            await expect(
                bangConfig.luckyBangUrl.updateValue(
                    'https://duckduckgo.com/?q=%q+!',
                ),
            ).resolves.toBe(true);
            await runTester('! google', [
                'url',
                'https://duckduckgo.com/?q=google+!',
            ]);
        });
        it('should update lucky bang', async () => {
            await expect(bangConfig.luckyBang.updateValue('#')).resolves.toBe(
                true,
            );
            await runTester('# google', [
                'url',
                'https://duckduckgo.com/?q=!+google',
            ]);
            await runTester('! google', ['search', '! google']);
        });
        it('should update site bang separator', async () => {
            await expect(bangConfig.siteBangSep.updateValue('#')).resolves.toBe(
                true,
            );
            await runTester('!#g', ['search', 'site:https://www.google.com/']);
            await runTester('!g#r', [
                'url',
                'https://www.google.com/search?q=' +
                    encodeURIComponent('site:https://www.reddit.com/'),
            ]);
            await runTester('!#g test', [
                'search',
                'site:https://www.google.com/ test',
            ]);
            await runTester('!g#r test', [
                'url',
                'https://www.google.com/search?q=' +
                    encodeURIComponent('site:https://www.reddit.com/ test'),
            ]);
            await runTester('!@g', ['search', '!@g']);
            await runTester('!@g test', ['search', '!@g test']);
            await runTester('!g@r', ['search', '!g@r']);
            await runTester('!g@r test', ['search', '!g@r test']);
        });
        it('should update or operator', async () => {
            await expect(bangConfig.orOperator.updateValue('#')).resolves.toBe(
                true,
            );
            await runTester('!@g,mdn', [
                'search',
                'site:https://www.google.com/ # site:https://developer.mozilla.org/',
            ]);
            await runTester('!@g,mdn test', [
                'search',
                'site:https://www.google.com/ # site:https://developer.mozilla.org/ test',
            ]);
            await runTester(
                '!@g,mdn;g;mdn',
                [
                    'search',
                    'site:https://www.google.com/ # site:https://developer.mozilla.org/',
                ],
                ['search', 'site:https://www.google.com/'],
                ['search', 'site:https://developer.mozilla.org/'],
            );
            await runTester(
                '!@g,mdn;g;mdn test',
                [
                    'search',
                    'site:https://www.google.com/ # site:https://developer.mozilla.org/ test',
                ],
                ['search', 'site:https://www.google.com/ test'],
                ['search', 'site:https://developer.mozilla.org/ test'],
            );
            await runTester('!g@r,mdn', [
                'url',
                'https://www.google.com/search?q=' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ # site:https://developer.mozilla.org/',
                    ),
            ]);
            await runTester('!ddg@mdn,r', [
                'url',
                'https://duckduckgo.com/?q=' +
                    encodeURIComponent(
                        'site:https://developer.mozilla.org/ # site:https://www.reddit.com/',
                    ),
            ]);
            await runTester('!g@r,mdn test', [
                'url',
                'https://www.google.com/search?q=' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ # site:https://developer.mozilla.org/ test',
                    ),
            ]);
            await runTester('!ddg@mdn,r test', [
                'url',
                'https://duckduckgo.com/?q=' +
                    encodeURIComponent(
                        'site:https://developer.mozilla.org/ # site:https://www.reddit.com/ test',
                    ),
            ]);
            await runTester(
                '!@r;g@r,g',
                ['search', 'site:https://www.reddit.com/'],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ # site:https://www.google.com/',
                        ),
                ],
            );
            await runTester(
                '!@r,g;g@r',
                [
                    'search',
                    'site:https://www.reddit.com/ # site:https://www.google.com/',
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
                    'site:https://www.reddit.com/ # site:https://www.google.com/',
                ],
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ # site:https://www.google.com/',
                        ),
                ],
            );
            await runTester('!!r,mdn', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ # site:https://developer.mozilla.org/',
                    ),
            ]);
            await runTester('!!r,mdn test', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ # site:https://developer.mozilla.org/ test',
                    ),
            ]);
            await runTester(
                '!!r,mdn;mdn',
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ # site:https://developer.mozilla.org/',
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
            await runTester(
                '!!r,mdn;mdn test',
                [
                    'url',
                    'https://duckduckgo.com/?q=!+' +
                        encodeURIComponent(
                            'site:https://www.reddit.com/ # site:https://developer.mozilla.org/ test',
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
        it('should update multi-bang delimiter', async () => {
            await expect(
                bangConfig.multiBangDelim.updateValue('#'),
            ).resolves.toBe(true);
            await runTester(
                '!g#mdn',
                ['url', 'https://www.google.com/'],
                ['url', 'https://developer.mozilla.org/'],
            );
            await runTester(
                '!g#mdn test',
                ['url', 'https://www.google.com/search?q=test'],
                ['url', 'https://developer.mozilla.org/search?q=test'],
            );
            await runTester(
                '!@g#mdn',
                ['search', 'site:https://www.google.com/'],
                ['search', 'site:https://developer.mozilla.org/'],
            );
            await runTester(
                '!@g#mdn test',
                ['search', 'site:https://www.google.com/ test'],
                ['search', 'site:https://developer.mozilla.org/ test'],
            );
            await runTester(
                '!g@r#mdn',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/'),
                ],
                ['url', 'https://developer.mozilla.org/'],
            );
            await runTester(
                '!g@r#mdn test',
                [
                    'url',
                    'https://www.google.com/search?q=' +
                        encodeURIComponent('site:https://www.reddit.com/ test'),
                ],
                ['url', 'https://developer.mozilla.org/search?q=test'],
            );
            await runTester(
                '!!r#mdn',
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
            await runTester(
                '!!r#mdn test',
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
            await runTester('!g;mdn', ['search', '!g;mdn']);
            await runTester('!g;mdn test', ['search', '!g;mdn test']);
            await runTester('!@g;mdn', ['search', '!@g;mdn']);
            await runTester('!@g;mdn test', ['search', '!@g;mdn test']);
            await runTester('!g@r;mdn', ['search', '!g@r;mdn']);
            await runTester('!g@r;mdn test', ['search', '!g@r;mdn test']);
            await runTester('!!r;mdn', ['search', '!!r;mdn']);
            await runTester('!!r;mdn test', ['search', '!!r;mdn test']);
        });
        it('should update multi-site bang delimiter', async () => {
            await expect(
                bangConfig.multiSiteBangDelim.updateValue('#'),
            ).resolves.toBe(true);
            await runTester('!@g#mdn', [
                'search',
                'site:https://www.google.com/ OR site:https://developer.mozilla.org/',
            ]);
            await runTester('!@g#mdn test', [
                'search',
                'site:https://www.google.com/ OR site:https://developer.mozilla.org/ test',
            ]);
            await runTester('!!r#mdn', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ OR site:https://developer.mozilla.org/',
                    ),
            ]);
            await runTester('!!r#mdn test', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent(
                        'site:https://www.reddit.com/ OR site:https://developer.mozilla.org/ test',
                    ),
            ]);
            await runTester('!@g,mdn', ['search', '!@g,mdn']);
            await runTester('!@g,mdn test', ['search', '!@g,mdn test']);
            await runTester('!!r,mdn', ['search', '!!r,mdn']);
            await runTester('!!r,mdn test', ['search', '!!r,mdn test']);
        });
        it('should update super lucky bang prefix', async () => {
            await expect(
                bangConfig.superLuckyBangPrefix.updateValue('#'),
            ).resolves.toBe(true);
            await runTester('#r', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent('site:https://www.reddit.com/'),
            ]);
            await runTester('#r test', [
                'url',
                'https://duckduckgo.com/?q=!+' +
                    encodeURIComponent('site:https://www.reddit.com/ test'),
            ]);
            await runTester('!!r', ['search', '!!r']);
            await runTester('!!r test', ['search', '!!r test']);
        });
        it('should push custom bangs', async () => {
            await expect(
                bangConfig.customBangs.pushBang({
                    name: 'Google',
                    shortcut: 'notgoogle',
                    domain: 'https://www.google.com',
                    url: 'https://www.google.com/search?q=%q',
                }),
            ).resolves.toBe(true);
            await runTester('!notgoogle', ['url', 'https://www.google.com']);
            await runTester('!notgoogle test', [
                'url',
                'https://www.google.com/search?q=test',
            ]);
            await runTester('!banger', [
                'url',
                'https://github.com/WhistlingZephyr/banger',
            ]);
            await runTester('!banger test', [
                'url',
                'https://github.com/WhistlingZephyr/banger',
            ]);
        });
        it('should update custom bangs', async () => {
            await expect(
                bangConfig.customBangs.updateBang({
                    name: 'Banger',
                    shortcut: 'banger',
                    domain: 'https://github.com/WhistlingZephyr/banger/issues',
                }),
            ).resolves.toBe(true);
            await runTester('!banger', [
                'url',
                'https://github.com/WhistlingZephyr/banger/issues',
            ]);
            await runTester('!banger test', [
                'url',
                'https://github.com/WhistlingZephyr/banger/issues',
            ]);
        });
        it('should remove custom bangs', async () => {
            await expect(
                bangConfig.customBangs.removeBang('banger'),
            ).resolves.toBe(true);
            await runTester('!banger', ['search', '!banger']);
            await runTester('!banger test', ['search', '!banger test']);
        });
    });
}
