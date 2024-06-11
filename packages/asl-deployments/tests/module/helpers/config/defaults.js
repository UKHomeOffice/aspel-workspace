import Reporter from '../../reporter/index.js';

const remoteDriverConfig = process.env.SELENIUM_HOST ? {
  host: process.env.SELENIUM_HOST,
  port: 4444,
  path: '/wd/hub'
} : {};

export const defaults = {
  ...remoteDriverConfig,
  specs: [],
  exclude: [],
  maxInstances: 2,
  capabilities: [{
    browserName: 'chrome',
    browserVersion: process.env.SELENIUM_HOST ? undefined : 'latest',
    'goog:chromeOptions': {
      args: ['headless', 'no-sandbox', 'disable-dev-shm-usage', 'force-device-scale-factor=1']
      // no-sandbox : workaround as per: https://stackoverflow.com/a/50791503/2219361
      // --disable-dev-shm-usage as per: https://stackoverflow.com/a/69175552/2219361
    }
  }],
  headless: true,
  logLevel: 'silent',
  execArgv: ['--max-old-space-size=3072'],
  bail: 0,
  baseUrl: 'http://localhost:8080',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: [ Reporter ],
  mochaOpts: {
    timeout: 1800000
  },
  slow: 30000
};
