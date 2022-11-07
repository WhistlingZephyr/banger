import Backend from '../models/backend';
import type {Bang} from '../models/backend';
import {withDefaultBase, withScheme} from '../utils/url';

/**
 * `c`: Category.\
 * `sc`: Subcategory.\
 * `d`: Domain.\
 * `s`: Title.\
 * `t`: Shortcut.\
 * `u`: URL.\
 * `r`: Rank.
 */
type DuckDuckGoBang = Record<'c' | 'd' | 's' | 'sc' | 't' | 'u', string> & {r: number};

export default class DuckDuckGo extends Backend<DuckDuckGoBang> {
    url = 'https://duckduckgo.com/bang.js';
    bangReplacement = '{{{s}}}';
    formatBang = ({t, d, u}: DuckDuckGoBang): Bang => ({
        shortcut: t,
        domain: withScheme(
            withDefaultBase(
                d || u.replace(this.bangReplacement, ''),
                'https://duckduckgo.com',
            ),
            'https',
        ),
        url: withDefaultBase(u, 'https://duckduckgo.com'),
    });
}
