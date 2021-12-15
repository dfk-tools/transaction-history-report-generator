# Transaction History Report Generator

JavaScript library used to collect and generate reports on historical transactions across multiple EVM chains for Defi Kingdoms.

## About the Project

This library serves as a package that can be used to collect transaction histories of users and contracts, and generate a report in various formats.
The [bounty](https://docs.google.com/document/d/1jwoIYrnyJGm31YdLyC3F5yNwUva0EIDrwJqVO9jTnCY/edit) for this project provides more detailed information about its uses.

## Getting started

Install the package into your project

```sh
npm install --save @dfk-tools/transaction-history-report-generator
```

## Usage

### Generating reports

```tsx
import { Generator } from '@dfk-tools/transaction-history-report-generator';

// Create a new instance of the report generator with default settings
const generator = new Generator();

// Generate a report for a player for all time, including all DFK interactions
const playerReport = await generator.report('[PLAYER ADDRESS]');

// Generate a report for a player, including transactions starting after a certain date
const startDate = new Date('2021-12-13');
const contractSince2021Dec13Report = await generator.report('[PLAYER ADDRESS]', {
    start: startDate
});

// Generate a report for a player for all time, including only hero purchase transactions
const playerHeroPurchasesReport = await generator.report('[PLAYER ADDRESS]', {
    contract: contracts.Hero
});
```

### Exporting

```tsx
import { resolve } from 'path';

// ...

// Save a report to a path with default options
const savePath = resolve(__dirname, './reports');
await report.exportAsCsv(savePath);
```

### Accessing report data

```tsx
// ...

const transactions = report.transactions;
console.log(transactions);
```
