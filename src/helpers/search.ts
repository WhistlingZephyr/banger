import {loadConfig, updateConfig} from '../utils/config';

export async function listEngines(): Promise<Engine[]> {
    let engines = await browser.search.get();
    engines = engines.filter(value => value.name !== 'Banger search');
    return engines;
}

export async function getEngine(): Promise<string> {
    const engines = await listEngines();
    const result = await loadConfig('engine', engines[0].name);
    return result;
}

export async function updateEngine(id: string): Promise<void> {
    const engines = await listEngines();
    if (!engines.some(engine => engine.name === id)) {
        throw new Error('Invalid engine');
    }

    await updateConfig({
        engine: id,
    });
}

export async function search(query: string, tabId: number): Promise<void> {
    const engine = await getEngine();
    browser.search.search({query, engine, tabId});
}
