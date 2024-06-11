#!/usr/bin/env node

import minimist from 'minimist';

import ppl from '../ppl/index.js';
import pil from '../pil/index.js';
import place from '../place/index.js';

const args = await minimist(process.argv.slice(2));
const TEST_ENV = args.env || 'local';
const KEYCLOAK_PASSWORD = args.password || process.env.KEYCLOAK_PASSWORD;
const env = { TEST_ENV, KEYCLOAK_PASSWORD };

const runners = { pil, ppl, place };
const suite = args._[0] || 'ppl';
const runner = runners[suite];

if (!runner) {
  throw new Error(`Unrecognised test runner: ${suite}`);
}

await Promise.resolve()
  .then(() => runner({ env, args }))
  .then(() => process.exit())
  .catch(err => {
    console.log(err);
    return process.exit(err.code || 1);
  });
