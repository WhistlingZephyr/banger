import {loadBackend, backendId} from '../helpers/bang';

(async (): Promise<void> => {
    loadBackend(await backendId.getValue());
})();
