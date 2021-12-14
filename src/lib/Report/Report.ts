import {
    CsvWriteOptions,
    Workbook,
    XlsxWriteOptions
} from 'exceljs';
import { ReportOptions } from './Report.types';
import { Transaction } from '../../types';

class Report {
    constructor(transactions: Transaction[], options?: ReportOptions) {
        const workbook = new Workbook();
        workbook.creator = 'DFK Tools';
        workbook.created = new Date();
        workbook.lastModifiedBy = 'DFK Tools';
        workbook.modified = new Date();
        workbook.title = options?.title || 'Transaction History';

        if (transactions.length > 0) {
            const worksheet = workbook.addWorksheet('Transactions');
            worksheet.addRow(Object.keys(transactions[0]));
            transactions.forEach(transaction => worksheet.addRow(Object.values(transaction)));
        }

        this.workbook = workbook;
        this.transactions = transactions;
    }

    protected workbook: Workbook;
    public readonly transactions: Transaction[];

    public async exportAsXlsx(path: string, options?: XlsxWriteOptions): Promise<void> {
        await this.workbook.xlsx.writeFile(path, options);
    }

    public async exportAsCsv(path: string, options?: CsvWriteOptions): Promise<void> {
        await this.workbook.csv.writeFile(path, options);
    }
}

export default Report;
