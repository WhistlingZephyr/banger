export async function loadConfig<T extends StorageValue>(id: string, initial: T): Promise<T> {
    try {
        const result = await browser.storage.sync.get(id);
        if (!result[id]) {
            await browser.storage.sync.set({[id]: initial});
            return initial;
        }

        return result[id] as T;
    } catch (error: unknown) {
        console.error(error);
        await browser.storage.sync.set({[id]: initial});
        return initial;
    }
}

export async function updateConfig(value: StorageObject): Promise<void> {
    await browser.storage.sync.set(value);
}
