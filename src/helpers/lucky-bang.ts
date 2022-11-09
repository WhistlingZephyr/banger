import {loadConfig, updateConfig} from '../utils/config';
import {isUrl} from '../utils/url';

export async function getLuckyBangUrl(): Promise<string> {
    return loadConfig<string>('lucky-bang-url', 'https://duckduckgo.com/?q=!+%s');
}

export async function updateLuckyBangUrl(url: string): Promise<void> {
    if (!isUrl(url)) {
        throw new Error(`Invalid URL "${url}"`);
    }

    if (!url.includes('%s')) {
        throw new Error(`URL "${url}" doesn't include "%s"`);
    }

    await updateConfig({
        'lucky-bang-url': url,
    });
}
