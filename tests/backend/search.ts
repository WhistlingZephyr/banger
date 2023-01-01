import {describe, it} from 'vitest';
import type {TestRunner} from '../utils/tester';

export default function search(runTester: TestRunner): void {
    describe('Search', () => {
        it('should allow search', async () => {
            await runTester('test', ['search', 'test']);
        });
        it('should resolve empty search', async () => {
            await runTester('', ['search', '']);
        });
        it('should resolve escaped search', async () => {
            await runTester('!@ test', ['search', 'test']);
        });
    });
}
