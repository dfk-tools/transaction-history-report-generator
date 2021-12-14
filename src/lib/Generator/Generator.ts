import { Harmony } from '@harmony-js/core';
import { fromBech32 } from '@harmony-js/crypto';
import {
    ChainID,
    ChainType
} from '@harmony-js/utils';
import { contracts } from '../../consts';
import { hmyv2 } from '../../utils';
import Report from '../Report';
import { ReportOptions } from '../Report';
import { GeneratorOptions, GeneratorReportFilters } from './Generator.types';

const contractAddresses = Object.values(contracts);

const defaultOptions: GeneratorOptions = {
    rpc: 'https://api.s0.t.hmny.io',
    chainId: ChainID.HmyMainnet,
    chainType: ChainType.Harmony
};

class Generator {
    constructor(options?: Partial<GeneratorOptions>) {
        const _options: GeneratorOptions = {
            rpc: options?.rpc || defaultOptions.rpc,
            chainId: options?.chainId || defaultOptions.chainId,
            chainType: options?.chainType || defaultOptions.chainType
        };
        this.harmony = new Harmony(_options.rpc, {
            chainId: _options.chainId,
            chainType: _options.chainType
        });
        this.options = _options;
    }

    protected harmony: Harmony;
    protected readonly options: GeneratorOptions;

    /**
     * Generate a transaction history report for a player
     * @param player Bech32/Checksum address of the player
     * @param options Optional object to change how the report is generated
     * @returns
     */
    public async report(player: string, filters?: GeneratorReportFilters, options?: Partial<ReportOptions>): Promise<Report> {
        let transactions = await hmyv2.getTransactionsHistory(this.options.rpc, player, {
            pageSize: filters?.limit
        });

        if (filters) {
            const optionsContract = filters.contract;
            if (optionsContract) {
                const includeIncomplete = filters.includeIncomplete ? filters.includeIncomplete : false;
                transactions = transactions.filter(transaction => {
                    if (!includeIncomplete && !transaction.blockHash) return false;

                    const checksumTo = fromBech32(transaction.to);
                    let include = true;
                    if (contractAddresses.includes(optionsContract)) {
                        if (checksumTo !== optionsContract) include = false;
                    } else {
                        if (!contractAddresses.includes(checksumTo)) include = false;
                    }
                    return include;
                });
            }
        }

        return new Report(transactions, options);
    }
}

export default Generator;
