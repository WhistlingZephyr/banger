import escapeStringRegexp from 'escape-string-regexp';
import {search} from '../helpers/search';
import ConfigBangs from './config-bangs';
import ConfigValue from './config-value';

export type Bang = {
    shortcut: string;
    domain: string;
    url?: string;
};

export type CustomBang = {name: string} & Bang;
export type BangConfig = Record<
    | 'luckyBangUrl'
    | 'siteFormat'
    | 'orOperator'
    | 'bangPrefix'
    | 'luckyBang'
    | 'siteBangSep'
    | 'superLuckyBangPrefix'
    | 'multiBangDelim'
    | 'multiSiteBangDelim'
    | 'engineName'
    | 'cacheLifetime'
    | 'caseSensitive',
    ConfigValue
> & {customBangs: ConfigBangs<CustomBang>};

type BangData =
    | {
          type: 'bang' | 'super';
          shortcut: string;
          query?: string;
      }
    | {
          type: 'lucky' | 'none';
          query: string;
      };

type QueryData = Array<{
    type: 'search' | 'url';
    entry: string;
}>;

export default abstract class Backend<T> {
    bangs: Bang[] = [];
    bangMap: Record<string, number> = {};
    #retrying: NodeJS.Timeout | undefined;
    #fetching = false;
    #processRetries = 0;
    cache = {
        backendUrl: new ConfigValue('cache-url', () => this.url),
        lastUpdated: new ConfigValue('cache-last-updated', '0', value =>
            Boolean(Number.parseInt(value, 10)),
        ),
        data: new ConfigBangs<Bang>(
            'cache-data',
            [],
            ['shortcut', 'domain'],
            ['url'],
            false,
        ),
    };

    abstract url: string;
    abstract bangReplacement: string;
    abstract formatBang: (element: T) => Bang | undefined;

    constructor(public readonly bangConfig: BangConfig) {
        this._handle = this._handle.bind(this);
    }

    hook(): void {
        browser.webRequest.onBeforeRequest.addListener(
            this._handle,
            {
                urls: ['https://banger/search?*'],
                types: ['main_frame'],
            },
            ['blocking'],
        );
    }

    unhook(): void {
        browser.webRequest.onBeforeRequest.removeListener(this._handle);
    }

    async fetch(retryInterval?: number): Promise<boolean> {
        if (this.#retrying !== undefined) {
            clearTimeout(this.#retrying);
            this.#retrying = undefined;
        }

        const success = await this._rawFetch();
        if (retryInterval && !success) {
            this._indexFormatted(await this.cache.data.getValue());
            this.#retrying = setTimeout(
                this.fetch,
                retryInterval,
                retryInterval,
            );
        }

        return success;
    }

    async extractBang(query: string): Promise<BangData> {
        const prefixes = {
            super: await this.bangConfig.superLuckyBangPrefix.getValue(),
            lucky: await this.bangConfig.luckyBang.getValue(),
            bang: await this.bangConfig.bangPrefix.getValue(),
        };
        for (const key in prefixes) {
            if (Object.hasOwn(prefixes, key)) {
                const prefix = prefixes[key as keyof typeof prefixes];
                const type = escapeStringRegexp(prefix);
                const patterns =
                    key === 'lucky'
                        ? [`${type}\\s+(?<query>.+)`, `(?<query>.+)\\s+${type}`]
                        : [
                              `${type}(?<shortcut>\\S+)(?:\\s+(?<query>.+))?`,
                              `$(?<shortcut>\\S+)${type}(?:\\s+(?<query>.+))?`,
                              `(?:(?<query>.+)\\s+)?${type}(?<shortcut>\\S+)`,
                              `(?:(?<query>.+)\\s+)?(?<shortcut>\\S+)${type}`,
                          ];
                for (const pattern of patterns) {
                    const match = new RegExp(`^\\s*${pattern}\\s*$`, 's').exec(
                        query,
                    );
                    if (match?.groups) {
                        return {
                            type: key as keyof typeof prefixes,
                            shortcut: match.groups.shortcut,
                            query: match.groups.query,
                        };
                    }
                }
            }
        }

        return {
            type: 'none',
            query,
        };
    }

    async processQuery(query: string): Promise<QueryData> {
        if (this.#fetching && this.bangs.length === 0) {
            if (this.#processRetries > 2) {
                this.#processRetries = 0;
                return [{type: 'search', entry: query}];
            }

            this.#processRetries++;
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
                    this.processQuery(query).then(resolve).catch(reject);
                }, 500);
            });
        }

        this.#processRetries = 0;
        const bangData = await this.extractBang(query);
        const multiDelim = await this.bangConfig.multiBangDelim.getValue();
        const multiSiteDelim =
            await this.bangConfig.multiSiteBangDelim.getValue();
        const luckyBangUrl = await this.bangConfig.luckyBangUrl.getValue();
        const siteSep = await this.bangConfig.siteBangSep.getValue();
        const orOperator = await this.bangConfig.orOperator.getValue();
        const siteFormat = await this.bangConfig.siteFormat.getValue();
        const customBangs = await this.bangConfig.customBangs.getValue();
        const caseSensitive =
            (await this.bangConfig.caseSensitive.getValue()) === 'true';
        const getBang = (shortcut: string): CustomBang | Bang | undefined => {
            const customBang = customBangs.find(bang =>
                caseSensitive
                    ? bang.shortcut === shortcut
                    : bang.shortcut.toLowerCase() === shortcut.toLowerCase(),
            );
            if (customBang) {
                if (customBang.url) {
                    return {
                        ...customBang,
                        url: customBang.url.replace('%q', this.bangReplacement),
                    };
                }

                return customBang;
            }

            const bangIndex =
                this.bangMap[caseSensitive ? shortcut : shortcut.toLowerCase()];
            if (!bangIndex) {
                return;
            }

            return this.bangs[bangIndex];
        };

        const getSiteQuery = (siteShortcut: string): string | undefined => {
            const domains = siteShortcut
                .split(multiSiteDelim)
                .map(shortcut => shortcut !== '' && getBang(shortcut)?.domain)
                .filter(Boolean) as string[];

            if (domains.length === 0) {
                return;
            }

            return (
                domains
                    .map(domain => siteFormat.replace('%d', domain))
                    .join(` ${orOperator} `) +
                (bangData.query ? ' ' + bangData.query : '')
            );
        };

        switch (bangData.type) {
            case 'bang': {
                if (bangData.shortcut === siteSep) {
                    return [{type: 'search', entry: bangData.query ?? query}];
                }

                if (
                    bangData.shortcut
                        .replaceAll(multiDelim, '')
                        .startsWith(siteSep) &&
                    [
                        ...(bangData.shortcut.match(
                            new RegExp(escapeStringRegexp(siteSep), 'g'),
                        ) ?? []),
                    ].length === 1
                ) {
                    return bangData.shortcut
                        .split(siteSep)[1]
                        .split(multiDelim)
                        .map(shortcut => ({
                            type: 'search',
                            entry: getSiteQuery(shortcut) ?? query,
                        }));
                }

                return bangData.shortcut.split(multiDelim).map(segment => {
                    const [bangShortcut, siteShortcut] = segment.split(siteSep);
                    const entry = siteShortcut
                        ? getSiteQuery(siteShortcut)
                        : bangData.query;
                    if (!bangShortcut && siteShortcut && entry) {
                        return {
                            type: 'search',
                            entry,
                        };
                    }

                    const bang = getBang(bangShortcut);
                    if (
                        !bang ||
                        (siteShortcut && !entry) ||
                        (!siteShortcut && segment.includes(siteSep))
                    ) {
                        return {
                            type: 'search',
                            entry: query,
                        };
                    }

                    if (!bang.url || !entry) {
                        return {
                            type: 'url',
                            entry: bang.domain,
                        };
                    }

                    const encodedReplacement = encodeURIComponent(
                        this.bangReplacement,
                    );
                    return {
                        type: 'url',
                        entry: bang.url.includes(encodedReplacement)
                            ? bang.url.replace(encodedReplacement, entry)
                            : bang.url.replace(
                                  this.bangReplacement,
                                  encodeURIComponent(entry),
                              ),
                    };
                });
            }

            case 'lucky': {
                return [
                    {
                        type: 'url',
                        entry: luckyBangUrl.replace(
                            '%q',
                            encodeURIComponent(bangData.query),
                        ),
                    },
                ];
            }

            case 'super': {
                return bangData.shortcut.split(multiDelim).map(shortcut => {
                    const siteQuery = getSiteQuery(shortcut);
                    if (!siteQuery) {
                        return {
                            type: 'search',
                            entry: query,
                        };
                    }

                    return {
                        type: 'url',
                        entry: luckyBangUrl.replace(
                            '%q',
                            encodeURIComponent(siteQuery),
                        ),
                    };
                });
            }

            default: {
                return [
                    {
                        type: 'search',
                        entry: bangData.query,
                    },
                ];
            }
        }
    }

    async isCacheValid(): Promise<boolean> {
        if ((await this.cache.backendUrl.getValue()) !== this.url) {
            return false;
        }

        const lastUpdated = Number.parseInt(
            await this.cache.lastUpdated.getValue(),
            10,
        );
        const lifetime = Number.parseInt(
            await this.bangConfig.cacheLifetime.getValue(),
            10,
        );
        if (Date.now() - lastUpdated >= lifetime) {
            return false;
        }

        const data = await this.cache.data.getValue();
        return data.length > 0;
    }

    private async _rawFetch(): Promise<boolean> {
        if (this.#fetching) {
            return false;
        }

        if (await this.isCacheValid()) {
            this._indexFormatted(await this.cache.data.getValue());
            return true;
        }

        try {
            this.#fetching = true;
            const response = await fetch(this.url);
            const data = (await response.json()) as T[];
            this._index(data);
            await this.cache.backendUrl.updateValue(this.url);
            await this.cache.lastUpdated.updateValue(Date.now().toString());
            await this.cache.data.updateValue(this.bangs);
            this.#fetching = false;
            return true;
        } catch (error: unknown) {
            console.error(error);
            this.#fetching = false;
            return false;
        }
    }

    private _indexFormatted(data: Bang[]): void {
        this.bangs = [];
        this.bangMap = {};
        for (const bang of data) {
            this.bangs.push(bang);
        }

        for (let i = 0; i < this.bangs.length; i++) {
            const bang = this.bangs[i];
            this.bangMap[bang.shortcut] = i;
        }

        this._indexMap();
    }

    private _index(data: T[]): void {
        this.bangs = [];
        this.bangMap = {};
        for (const element of data) {
            const bang = this.formatBang(element);
            if (bang) {
                this.bangs.push(bang);
            }
        }

        this._indexMap();
    }

    private _indexMap(): void {
        for (let i = 0; i < this.bangs.length; i++) {
            const bang = this.bangs[i];
            this.bangMap[bang.shortcut] = i;
        }
    }

    private async _handle(
        request: RequestDetails,
    ): Promise<BlockingResponse | undefined> {
        const url = new URL(request.url);
        const query = url.searchParams.get('q');
        if (!query) {
            return;
        }

        const queryData = await this.processQuery(query);
        if (queryData[0].type === 'search') {
            search(queryData[0].entry, request.tabId);
            return {
                cancel: true,
            };
        }

        for (const {type, entry} of queryData.slice(1)) {
            if (type === 'search') {
                search(entry);
            } else {
                browser.tabs.create({openerTabId: request.tabId, url: entry});
            }
        }

        return {
            redirectUrl: queryData[0].entry,
        };
    }
}
