import minimist from 'minimist';
import {existsSync} from 'fs';
import { parseWdioLogFailures } from '../../tests/helpers/parse-wdio-log-failures.js';

const usage = `
Parse WDIO logs and terminate with a non-zero exit code if any test failures were logged.

Usage

    npm run test:check-wdio-log-file -- --logfile=wdio.log
`;

const { logfile } = minimist(process.argv.slice(2));

if (!logfile) {
  console.error('Logfile was not provided');
  console.log(usage);
  process.exit(1);
}

if (!existsSync(logfile)) {
  console.error(`Logfile ${logfile} was not found`);
  console.log(usage);
  process.exit(1);
}

const failures = parseWdioLogFailures(logfile);

process.exit(failures.length > 0 ? 1 : 0);
