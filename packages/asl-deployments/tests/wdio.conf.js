import 'dotenv/config';
import testUrls from './test-urls.js';
import testUsers from './test-users.js';
import addCommands from './helpers/add-commands.js';
import Reporter from './module/reporter/index.js';
import screenShotOnFail from './helpers/screenshot-on-fail.js';
import { parseWdioLogFailures } from './helpers/parse-wdio-log-failures.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const env = process.env.TEST_ENV || 'local';

const remoteDriverConfig = process.env.SELENIUM_HOST ? {
  host: process.env.SELENIUM_HOST,
  port: 4444,
  path: '/wd/hub'
} : {};

// If the log of a previous run is provided in WDIO_LOG_FILE, only run tests
// that failed in the previous run.
let failedSpecs = null;

if (process.env.WDIO_LOG_FILE) {
  failedSpecs = parseWdioLogFailures(process.env.WDIO_LOG_FILE);
  if (failedSpecs.length === 0) {
    console.log('No failed specs found to re-run');
    process.exit(0);
  }
}

export const config = {
  // Expected usage:
  // 1. Test suite is run without WDIO_LOG_FILE, so failedSpecs is null and runs all tests by default
  // 2. If there are failures:
  //     a. The database is reseeded (which is why we can't re-run tests using WDIO retries)
  //     b. WDIO_LOG_FILE from the first run is passed to a re-run of the specs, so failedSpecs is used
  specs: failedSpecs ?? [
    // './internal/specs/**/*.js',
    // './public/specs/**/*.js',
    // './mixed/specs/**/*.js'
    // './mixed/specs/projects/additional-availability.js'
    './mixed/specs/projects/version-comparison/amendment.js'
  ],
  exclude: !process.env.CI ? [
    // when running locally, exclude tests that can conflict with dev env (e.g. changes to keycloak)
    `./public/specs/profiles/change-email-address.js`,
    `./public/specs/profiles/change-password.js`,
    `./public/specs/profiles/email-verification.js`
  ] : [],
  maxInstances: process.env.CI ? 10 : 4,
  capabilities: [{
    browserName: 'chrome',
    browserVersion: process.env.SELENIUM_HOST ? undefined : 'latest',
    'goog:chromeOptions': {
      args: ['headless', 'no-sandbox', 'disable-dev-shm-usage', 'force-device-scale-factor=1']
      // no-sandbox : workaround as per: https://stackoverflow.com/a/50791503/2219361
      // --disable-dev-shm-usage as per: https://stackoverflow.com/a/69175552/2219361
    }
  }],
  ...remoteDriverConfig,
  logLevel: 'silent',
  bail: 0,
  baseUrl: testUrls[env],
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: [Reporter],
  mochaOpts: {
    ui: 'bdd',
    timeout: 1800000
  },
  // slow: 30000,
  // flags: ['--whitelisted-ips', '--force-color-profile=srgb'],
  before: async function () {
    await browser.setTimeout({ implicit: 500 });
    addCommands(config);
  },
  defaultUser: 'holc',
  users: testUsers,
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
};
