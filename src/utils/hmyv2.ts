import { fromBech32 } from '@harmony-js/crypto';
import { isBech32Address } from '@harmony-js/utils';
import axios from 'axios';
import { Transaction } from '../types';

// These methods are not available via the @harmony-js/core package and thus need to be called directly

export type getTransactionHistoryFilters = {
    page?: number;
    pageSize?: number;
    type?: 'ALL' | 'SENT' | 'RECEIVED';
    order?: 'ASC' | 'DESC';
}

export type getTransactionHistoryResponse = {
    jsonrpc: '2.0',
    id: '1',
    result: {
        transactions: Transaction[];
    }
};
export async function getTransactionsHistory(
    rpc: string,
    address: string,
    filters?: getTransactionHistoryFilters
): Promise<Transaction[]> {
    const checksumAddress = isBech32Address(address) ? fromBech32(address) : address;
    const data = {
        jsonrpc: '2.0',
        id: '1',
        method: 'hmyv2_getTransactionsHistory',
        params: [{
            address: checksumAddress,
            pageIndex: filters?.page || 0,
            pageSize: filters?.pageSize || 100000,
            fullTx: true,
            txType: filters?.type || 'ALL',
            order: filters?.order
        }]
    };

    const response = await axios.post(rpc, data);

    if (response.status === 200 && response.data) {
        const data = response.data as getTransactionHistoryResponse;
        return data.result.transactions;
    } else throw new Error();
}
