import Backend from '../models/backend';
import type {Bang} from '../models/backend';
import {withScheme} from '../utils/url';

type BraveBang = {
    bang: string;
    meta: {
        scheme: string;
        netloc: string;
        hostname: string;
        favicon: string;
        path: string;
    };
    category: string;
    sub_category: string;
    title: string;
    url: string;
};

export default class Brave extends Backend<BraveBang> {
    url = 'https://search.brave.com/bang/data';
    bangReplacement = '{query}';
    formatBang = (bang: BraveBang): Bang => ({
        shortcut: bang.bang,
        domain: withScheme(bang.meta.hostname, bang.meta.scheme),
        url: bang.url,
    });
}
