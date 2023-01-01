import {afterEach, beforeAll, describe, expect, vi} from 'vitest';
import bangs from './backend/bangs';
import configUpdates from './backend/config-updates';
import customBangs from './backend/custom-bangs';
import luckyBang from './backend/lucky-bang';
import mixedSiteBangs from './backend/mixed-site-bangs';
import relativeBangs from './backend/relative-bangs';
import search from './backend/search';
import siteBangs from './backend/site-bangs';
import superLuckyBangs from './backend/super-lucky-bangs';
import superMixedSiteBangs from './backend/super-mixed-site-bangs';
import {type Backend, bangConfig} from '@/helpers/bang';
import DuckDuckGo from '@/backends/ddg';
import Brave from '@/backends/brave';

vi.mock(
    '../src/models/config-bangs.ts',
    async () => import('./mocks/config-bangs'),
);
vi.mock(
    '../src/models/config-value.ts',
    async () => import('./mocks/config-value'),
);

const fetchBackend = (backend: Backend): void => {
    beforeAll(async () => {
        await backend.fetch();
    });
};

const registerCleanup = (): void => {
    afterEach(async () => {
        await Promise.all(
            Object.values(bangConfig).map(async config =>
                (
                    config.updateValue as (
                        value: typeof config.defaultValue,
                    ) => Promise<boolean>
                )(await config.getDefaultValue()),
            ),
        );
    });
};

const createTester =
    (backend: Backend) =>
    async (
        query: string,
        ...data: Array<['url' | 'search', string]>
    ): Promise<void> =>
        expect(backend.processQuery(query)).resolves.toEqual(
            data.map(([type, entry]) => ({type, entry})),
        );

type TestRunner = ReturnType<typeof createTester>;

const testCommon = (runTester: TestRunner): void => {
    search(runTester);
    bangs(runTester);
    luckyBang(runTester);
    siteBangs(runTester);
    mixedSiteBangs(runTester);
    superMixedSiteBangs(runTester);
    superLuckyBangs(runTester);
    customBangs(runTester);
    configUpdates(runTester);
};

describe('DuckDuckGo bangs', () => {
    const backend = new DuckDuckGo(bangConfig);
    const runTester = createTester(backend);
    fetchBackend(backend);
    registerCleanup();
    testCommon(runTester);
    relativeBangs(runTester);
});

describe('Brave bangs', () => {
    const backend = new Brave(bangConfig);
    const runTester = createTester(backend);
    fetchBackend(backend);
    registerCleanup();
    testCommon(runTester);
});
