import { fromBech32 } from '@harmony-js/crypto';
import { isBech32Address } from '@harmony-js/utils';
import { existsSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { contracts } from '../../consts';
import Generator from './Generator';

const reports = resolve(__dirname, '../../../reports');
const jestGeneratorTestPath = join(reports, 'jest_generator_test.xlsx');

jest.useRealTimers();
jest.setTimeout(10000);

describe('Generator', () => {
    let generator: Generator;

    beforeAll(() => {
        generator = new Generator();
    });

    it('generates a transaction report for a player and exports as a .xlsx file', async () => {
        const report = await generator.report('0xd54381b664ddd8B844743884f5aee3fA72D8C502');
        await report.exportAsXlsx(jestGeneratorTestPath);
        expect(existsSync(jestGeneratorTestPath)).toBe(true);
        rmSync(jestGeneratorTestPath);
    });

    it('generates a transaction report for a player, including only interactions with the UniswapV2Router02 contract', async () => {
        const report = await generator.report('0xd54381b664ddd8B844743884f5aee3fA72D8C502', {
            contract: contracts.UniswapV2Router02
        });
        expect(report.transactions.some(transaction => {
            const checksumTo = isBech32Address(transaction.to) ? fromBech32(transaction.to) : transaction.to;
            const checksumFrom = isBech32Address(transaction.from) ? fromBech32(transaction.from) : transaction.from;

            let hasUnknownContract = false;
            if (checksumTo !== contracts.UniswapV2Router02 && checksumFrom !== contracts.UniswapV2Router02) hasUnknownContract = true;
            expect(hasUnknownContract).toBe(false);
        }));
    });
});
