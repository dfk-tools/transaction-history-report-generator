import { ChainID, ChainType } from '@harmony-js/utils';
import { join, resolve } from 'path';
import prompts from 'prompts';
import { Generator } from '../src/lib';
import { contracts } from '../src/consts';

const contractKeys = Object.keys(contracts);
const reportsPath = resolve(__dirname, '../reports');

async function wizard() {
    console.log('Welcome to the Defi Kingdoms transaction history report generator wizard!');
    console.log('This tool will allow you to generate reports via the command line.');

    const generators: Record<string, Generator> = {};

    async function mainMenu() {
        const { menuSelection } = await prompts({
            choices: [
                { title: 'Create a generator', value: 'createGenerator' },
                { title: 'Create a report', value: 'createReport' }
            ],
            message: 'Main Menu',
            name: 'menuSelection',
            type: 'select'
        }) as { menuSelection: 'createGenerator' | 'createReport';};

        switch (menuSelection) {
            case 'createGenerator':
                await createGenerator();
                break;
            case 'createReport':
                await createReport();
                break;
        }
    }

    async function createGenerator() {
        console.log('Create a new generator');

        const { name } = await prompts({
            message: 'Generator name',
            name: 'name',
            type: 'text'
        }) as { name: string; };

        const { rpc } = await prompts({
            message: 'RPC Endpoint',
            name: 'rpc',
            type: 'text'
        }) as { rpc: string; };

        const { chainId } = await prompts({
            // @ts-ignore
            choices: Object.keys(ChainID).map(chainIdKey => ({ title: chainIdKey, value: ChainID[chainIdKey] })),
            message: 'Chain ID',
            name: 'chainId',
            type: 'select'
        }) as { chainId: ChainID; };

        const { chainType } = await prompts({
            // @ts-ignore
            choices: Object.keys(ChainType).map(chainTypeKey => ({ title: chainTypeKey, value: ChainType[chainTypeKey] })),
            message: 'Chain Type',
            name: 'chainType',
            type: 'select'
        }) as { chainType: ChainType; };

        generators[name] = new Generator({
            rpc,
            chainId,
            chainType
        });

        console.log('Generator created, returning to main menu...');

        await mainMenu();
    }

    async function createReport() {
        const generatorKeys = Object.keys(generators);
        if (generatorKeys.length === 0) {
            console.log('No generators found, please create one first.');
            return await mainMenu();
        }

        const { generator } = await prompts({
            choices: generatorKeys.map(generatorKey => {
                const generator = generators[generatorKey];
                return { title: generatorKey, value: generator };
            }),
            message: 'Select a generator to use',
            name: 'generator',
            type: 'select'
        }) as { generator: Generator };

        const { player } = await prompts({
            message: 'Enter the Harmony or Ethererum-style address of a player',
            name: 'player',
            type: 'text'
        }) as { player: string };

        const { filterContract } = await prompts({
            message: 'Filter transactions by a contract?',
            name: 'filterContract',
            type: 'confirm'
        }) as { filterContract: boolean };

        let contract: string | undefined;
        if (filterContract) {
            contract = (await prompts({
                // @ts-ignore
                choices: contractKeys.map(contractKey => ({ title: contractKey, value: contracts[contractKey] })),
                message: 'Select a DFK contract',
                name: 'contract',
                type: 'select'
            }) as { contract: string; }).contract;
        }

        const { filterLimit } = await prompts({
            message: 'Set a limit to number of transactions retrieved?',
            name: 'filterLimit',
            type: 'confirm'
        }) as { filterLimit: boolean; };

        let limit: number | undefined;
        if (filterLimit) {
            limit = (await prompts({
                message: 'Enter a limit',
                name: 'limit',
                type: 'number',
                validate: (prev, values) => {
                    if (!Number.isInteger(values.limit)) return 'Limit must be an integer.';
                    if (values.limit <= 0) return 'Limit must be greater than 0.';
                    return true;
                }
            })).limit;
        }

        const { title } = await prompts({
            message: 'Enter a title for the report',
            name: 'title',
            type: 'text'
        }) as { title: string; };

        console.log('Generating report...');

        const report = await generator.report(player, {
            contract,
            limit
        }, { title });

        console.log('Report generated.');

        const fileName = title.endsWith('.xlsx') ? title : `${title}.xlsx`;

        const reportFilePath = join(reportsPath, fileName);
        await report.exportAsXlsx(reportFilePath);

        console.log(`Report file saved to ${reportFilePath}`);
    }

    await mainMenu();
}

wizard();
