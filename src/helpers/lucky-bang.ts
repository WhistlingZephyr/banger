import {loadConfig, updateConfig} from '../utils/config';

export async function getLuckyBangUrl(): Promise<string> {
    return loadConfig<string>('lucky-bang-url', 'https://duckduckgo.com/?q=!+%s');
}

export async function updateLuckyBangUrl(url: string): Promise<void> {
    await updateConfig({
        'lucky-bang-url': url,
    });
}
