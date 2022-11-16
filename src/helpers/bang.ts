import Brave from '../backends/brave';
import DuckDuckGo from '../backends/ddg';
import {loadConfig, updateConfig} from '../utils/config';

export type Backend = DuckDuckGo | Brave;
export type BackendId = 'brave' | 'ddg';
const backendList = new Set(['brave', 'ddg']);
let backend: DuckDuckGo | Brave;

export async function getBackendId(): Promise<BackendId> {
    const id = await loadConfig<BackendId>('backend', 'ddg', value => backendList.has(value));
    return id;
}

export async function updateBackend(id: BackendId): Promise<void> {
    if (!backendList.has(id)) {
        throw new Error(`Invalid backend id "${id}"`);
    }

    await updateConfig({
        backend: id,
    });
    await loadBackend();
}

export function getBackendInstance(): Backend {
    return backend;
}

export async function loadBackend(): Promise<void> {
    if (backend) {
        backend.unhook();
    }

    const id = await getBackendId();
    backend = id === 'brave' ? new Brave() : new DuckDuckGo();
    await backend.fetch();
    backend.hook();
}
