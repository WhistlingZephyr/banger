import Brave from '../src/backends/brave';
import DuckDuckGo from '../src/backends/ddg';
import type {Backend} from '../src/helpers/bang';
import {updateLuckyBangUrl} from '../src/helpers/lucky-bang';
import {getMockedFn} from './get-mocked';

const fetchBackend = (backend: Backend): void => {
    beforeAll(async () => {
        await backend.fetch();
    });
};

const cleanupStorage = (): void => {
    afterEach(async () => {
        await browser.storage.sync.clear();
        getMockedFn(browser.storage.sync.get).mockClear();
        getMockedFn(browser.storage.sync.set).mockClear();
    });
};

const testDomain = (backend: Backend): void => {
    test('should resolve domain', async () => {
        await expect(backend.processQuery('!g')).resolves.toBe('https://www.google.com');
        await expect(backend.processQuery('!mdn')).resolves.toBe('https://developer.mozilla.org');
        await expect(backend.processQuery('!abcd')).resolves.toBeUndefined();
    });
};

const testQuery = (backend: Backend): void => {
    test('should resolve query', async () => {
        await expect(backend.processQuery('!g test')).resolves.toBe('https://www.google.com/search?q=test');
        await expect(backend.processQuery('!mdn test')).resolves.toBe('https://developer.mozilla.org/search?q=test');
        await expect(backend.processQuery('!abcd test')).resolves.toBeUndefined();
    });
};

const testLuckySearch = (backend: Backend): void => {
    test('should handle lucky search', async () => {
        await expect(backend.processQuery('! google')).resolves.toBe('https://duckduckgo.com/?q=!+google');
        expect(browser.storage.sync.get).toBeCalledTimes(1);
        expect(browser.storage.sync.set).toHaveBeenCalledWith({
            'lucky-bang-url': 'https://duckduckgo.com/?q=!+%s',
        });
    });
    test('should update lucky search url', async () => {
        await expect(updateLuckyBangUrl('https://duckduckgo.com/?q=%s+!')).resolves.toBeUndefined();
        await expect(backend.processQuery('! google')).resolves.toBe('https://duckduckgo.com/?q=google+!');
        expect(browser.storage.sync.get).toBeCalledTimes(1);
        expect(browser.storage.sync.set).toHaveBeenCalledTimes(1);
    });
};

describe('DuckDuckGo bangs', () => {
    const backend = new DuckDuckGo();
    fetchBackend(backend);
    testDomain(backend);
    testQuery(backend);
    testLuckySearch(backend);
    test('should resolve relative bangs', async () => {
        await expect(backend.processQuery('!bang')).resolves.toBe('https://duckduckgo.com/bang?q=');
        await expect(backend.processQuery('!bang test')).resolves.toBe('https://duckduckgo.com/bang?q=test');
        await expect(backend.processQuery('!xkcd test')).resolves.toBe('https://duckduckgo.com/?q=test+site:xkcd.com');
    });
    cleanupStorage();
});

describe('Brave bangs', () => {
    const backend = new Brave();
    fetchBackend(backend);
    testDomain(backend);
    testQuery(backend);
    testLuckySearch(backend);
    cleanupStorage();
});
