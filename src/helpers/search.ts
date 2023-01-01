import ConfigValue from '../models/config-value';

export async function listEngines(): Promise<Engine[]> {
    let engines = await browser.search.get();
    engines = engines.filter(value => value.name !== 'Banger search');
    return engines;
}

export const engineName = new ConfigValue(
    'engine',
    async () => {
        const engines = await listEngines();
        return engines[0].name;
    },
    async name => {
        const engines = await listEngines();
        return engines.some(engine => engine.name === name);
    },
);

export async function search(query: string, tabId?: number): Promise<void> {
    const engine = await engineName.getValue();
    browser.search.search({query, engine, tabId});
}
