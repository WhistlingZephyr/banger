import {search} from '../helpers/search';
import {getLuckyBangUrl} from '../helpers/lucky-bang';

export type Bang = {
    shortcut: string;
    domain: string;
    url: string;
};

export default abstract class Backend<T> {
    bangs: Bang[] = [];
    bangMap: Record<string, number> = {};
    abstract url: string;
    abstract bangReplacement: string;
    abstract formatBang: (element: T) => Bang | undefined;

    constructor() {
        this._handle = this._handle.bind(this);
    }

    /**
     * Add listener for rewriting requests
     */
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

    /**
     * Remove listener for rewriting requests
     */
    unhook(): void {
        browser.webRequest.onBeforeRequest.removeListener(this._handle);
    }

    /**
     * Download relevant data for current backend
     */
    async fetch(): Promise<void> {
        const response = await fetch(this.url);
        const json = await response.json() as T[];
        for (const element of json) {
            const bang = this.formatBang(element);
            if (bang) {
                this.bangs.push(bang);
            }
        }

        for (let i = 0; i < this.bangs.length; i++) {
            const bang = this.bangs[i];
            this.bangMap[bang.shortcut] = i;
        }
    }

    /**
     * Extract bang strring from given query
     * @param query The current search query
     * @returns The matched bang string, or undefined
     */
    extractBang(query: string): string | undefined {
        return (/(?<=!)\S+|\S+(?=!)/.exec(query))?.[0].toLowerCase();
    }

    /**
     * Return the redirect url if available
     * @param query The search query
     */
    async processQuery(query: string): Promise<string | undefined> {
        const bangShortcut = this.extractBang(query);

        if (!bangShortcut) {
            if (/!\s+\S+|\S+\s+!/.test(query)) {
                const luckyBangUrl = await getLuckyBangUrl();
                return luckyBangUrl.replace(
                    '%s',
                    encodeURIComponent(query.replace(/!\s+|\s+!/, '')),
                );
            }

            return;
        }

        const bangIndex = this.bangMap[bangShortcut];
        if (!bangIndex) {
            return;
        }

        const bang = this.bangs[bangIndex]!;
        const bangQuery = query.replace(/!\S+\s*|\s*\S+!/, '');
        if (bangQuery) {
            return bang.url.replace(
                this.bangReplacement,
                encodeURIComponent(bangQuery),
            );
        }

        return bang.domain;
    }

    private async _handle(request: RequestDetails): Promise<BlockingResponse | undefined> {
        const url = new URL(request.url);
        const query = url.searchParams.get('q');
        if (!query) {
            return;
        }

        const redirectUrl = await this.processQuery(query);
        if (!redirectUrl) {
            search(query, request.tabId);
            return {
                cancel: true,
            };
        }

        return {
            redirectUrl,
        };
    }
}
