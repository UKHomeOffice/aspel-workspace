import { helpers } from './module/index.js';
import screenShotOnFail from './helpers/screenshot-on-fail.js';
import addCommands from './helpers/add-commands.js';
// import * as url from 'url';
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import m from 'minimist';
const argv = m(process.argv.slice(2), {
  string: 'spec',
  boolean: 'headless',
  number: ['bail', 'maxInstances'],
  default: {
    headless: true,
    bail: 2,
    maxInstances: 10
  }
});

// you can override a full test suite run with
// npm run test:integration -- --spec='<path/to/specfile>' e.g.
// npm run test:integration -- --spec='tests/internal/specs/rops/rops-summary-report.js'
const { spec, ...opts } = argv;

console.log(`NODE_DEBUG=${process.env.NODE_DEBUG}`);
console.log(`__dirname=${__dirname}`);

const config = helpers.setConfig({
  ...opts,
  specs: spec || [
    // `${__dirname}/mixed/specs/**/*.js`,
    `${__dirname}/internal/specs/downloads/index.js`
    // `${__dirname}/public/specs/**/*.js`
  ],
  exclude: !process.env.CI
    ? [
      // when running locally, exclude tests that can conflict with dev env (e.g. changes to keycloak)
      `${__dirname}/public/specs/profiles/change-email-address.js`,
      `${__dirname}/public/specs/profiles/change-password.js`,
      `${__dirname}/public/specs/profiles/email-verification.js`
    ]
    : [],
  urls: {
    local: 'http://localhost:8080',
    dev: 'https://public-ui.dev.asl.homeoffice.gov.uk',
    preprod: 'https://public-ui.preprod.asl.homeoffice.gov.uk'
  },
  flags: [
    '--whitelisted-ips',
    '--disable-dev-shm-usage',
    '--force-device-scale-factor=1',
    '--force-color-profile=srgb'
  ],
  before: () => {
    browser.setTimeout({ implicit: 500 });
    addCommands();
  },
  services: [
    [
      'image-comparison',
      {
        screenshotPath: __dirname
      }
    ]
  ],
  afterTest: screenShotOnFail,
  afterHook: screenShotOnFail
});

export default config;
