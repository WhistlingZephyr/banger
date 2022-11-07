import Brave from '../backends/brave';
import DuckDuckGo from '../backends/ddg';
import {loadConfig, updateConfig} from '../utils/config';

export type Backend = DuckDuckGo | Brave;
export type BackendId = 'brave' | 'ddg';
let backend: DuckDuckGo | Brave;

export async function getBackend(): Promise<BackendId> {
    const id = await loadConfig<BackendId>('backend', 'ddg');
    return id;
}

export async function loadBackend(): Promise<void> {
    if (backend) {
        backend.unhook();
    }

    const id = await getBackend();
    backend = id === 'brave' ? new Brave() : new DuckDuckGo();
    await backend.fetch();
    backend.hook();
}

export async function updateBackend(id: BackendId): Promise<void> {
    if (!['brave', 'ddg'].includes(id)) {
        throw new Error(`Invalid backend id "${id}"`);
    }

    await updateConfig({
        backend: id,
    });
    await loadBackend();
}
