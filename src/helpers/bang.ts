import Brave from '../backends/brave';
import DuckDuckGo from '../backends/ddg';
import type {BangConfig, CustomBang} from '../models/backend';
import ConfigBangs from '../models/config-bangs';
import ConfigValue from '../models/config-value';
import {isUrl} from '../utils/url';
import {engineName} from './search';
import time from '@/utils/time';

export type Backend = DuckDuckGo | Brave;
export type BackendId = 'brave' | 'ddg';
let backend: DuckDuckGo | Brave;

export const backendId = new ConfigValue(
    'backend',
    'ddg',
    value => value === 'brave' || value === 'ddg',
    loadBackend,
);

export function getBackendInstance(): Backend {
    return backend;
}

const validate = (value: string): boolean => /^\S+$/.test(value);

export const bangConfig: BangConfig = {
    luckyBangUrl: new ConfigValue(
        'lucky-bang-url',
        'https://duckduckgo.com/?q=!+%q',
        (url: string) => isUrl(url) && url.includes('%q'),
    ),
    siteFormat: new ConfigValue('site-format', 'site:%d', (value: string) =>
        value.includes('%d'),
    ),
    orOperator: new ConfigValue('or-operator', 'OR'),
    bangPrefix: new ConfigValue('bang-prefix', '!', validate),
    luckyBang: new ConfigValue('lucky-bang', '!', validate),
    siteBangSep: new ConfigValue('site-bang-sep', '@', validate),
    superLuckyBangPrefix: new ConfigValue(
        'super-lucky-bang-prefix',
        '!!',
        validate,
    ),
    multiBangDelim: new ConfigValue('multi-bang-delim', ';', validate),
    multiSiteBangDelim: new ConfigValue('multi-site-bang-delim', ',', validate),
    engineName,
    customBangs: new ConfigBangs<CustomBang>(
        'custom-bangs',
        [
            {
                name: 'Bang list',
                shortcut: 'bang',
                domain: 'https://duckduckgo.com/bangs',
                url: 'https://duckduckgo.com/bangs?q=%q',
            },
            {
                name: 'Banger',
                shortcut: 'banger',
                domain: 'https://github.com/WhistlingZephyr/banger',
            },
        ],
        ['name', 'shortcut', 'domain'],
        ['url'],
        true,
    ),
    cacheLifetime: new ConfigValue('cache-lifetime', '1d', value =>
        Boolean(time(value)),
    ),
};

export async function loadBackend(id: string): Promise<void> {
    if (backend) {
        backend.unhook();
    }

    backend =
        id === 'brave' ? new Brave(bangConfig) : new DuckDuckGo(bangConfig);
    await backend.fetch(1000);
    backend.hook();
}
