import {expect} from 'vitest';
import {type Backend} from '@/helpers/bang';

export const createTester =
    (backend: Backend) =>
    async (
        query: string,
        ...data: Array<['url' | 'search', string]>
    ): Promise<void> =>
        expect(backend.processQuery(query)).resolves.toEqual(
            data.map(([type, entry]) => ({type, entry})),
        );

export type TestRunner = ReturnType<typeof createTester>;
