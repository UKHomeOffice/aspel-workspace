import { install } from '../install.js';
import { config } from 'dotenv';

import { defaults } from './defaults.js';

export { install } from '../install.js';
export { defaults } from './defaults.js';

try { config(); } catch (e) {}

const env = process.env.TEST_ENV || 'local';

export function setConfig (settings) {
  const config = {
    ...defaults,
    defaultUser: 'holc',
    defaultPassword: process.env.KEYCLOAK_PASSWORD,
    users: {
      'unverified': process.env.KEYCLOAK_PASSWORD,
      'additionalavailability': process.env.KEYCLOAK_PASSWORD,
      'newuser': process.env.KEYCLOAK_PASSWORD,
      'holc': process.env.KEYCLOAK_PASSWORD,
      'spareholc': process.env.KEYCLOAK_PASSWORD,
      'ntco': process.env.KEYCLOAK_PASSWORD,
      'basicntco': process.env.KEYCLOAK_PASSWORD,
      'read': process.env.KEYCLOAK_PASSWORD,
      'basic': process.env.KEYCLOAK_PASSWORD,
      'basic2': process.env.KEYCLOAK_PASSWORD,
      'basic3': process.env.KEYCLOAK_PASSWORD,
      'blocked': process.env.KEYCLOAK_PASSWORD,
      'piltransfer': process.env.KEYCLOAK_PASSWORD,
      'pharmaadmin': process.env.KEYCLOAK_PASSWORD,
      'marvellntco': process.env.KEYCLOAK_PASSWORD,
      'trainingadmin': process.env.KEYCLOAK_PASSWORD,
      'trainingntco': process.env.KEYCLOAK_PASSWORD,
      'collabedit': process.env.KEYCLOAK_PASSWORD,
      'collabread': process.env.KEYCLOAK_PASSWORD,
      'email-change-before@example.com': process.env.KEYCLOAK_PASSWORD,
      'email-change-after@example.com': process.env.KEYCLOAK_PASSWORD,
      'password-change@example.com': process.env.KEYCLOAK_PASSWORD,
      'due-pil-review@example.com': process.env.KEYCLOAK_PASSWORD,
      'overdue-pil-review@example.com': process.env.KEYCLOAK_PASSWORD,
      'asrusuper': process.env.KEYCLOAK_PASSWORD,
      'asruadmin': process.env.KEYCLOAK_PASSWORD,
      'asrusupport': process.env.KEYCLOAK_PASSWORD,
      'asruropper': process.env.KEYCLOAK_PASSWORD,
      'licensing': process.env.KEYCLOAK_PASSWORD,
      'inspector': process.env.KEYCLOAK_PASSWORD,
      'inspector2': process.env.KEYCLOAK_PASSWORD,
      'inspector-rops': process.env.KEYCLOAK_PASSWORD
    },
    baseUrl: settings.urls[env],
    ...settings
  };
  if (config.flags) {
    config.capabilities[0]['goog:chromeOptions'].args.push(...config.flags);
  }
  if (config.headless) {
    config.capabilities[0]['goog:chromeOptions'].args.push('--headless', '--disable-gpu');
  }
  if (config.sample !== false) {
    (async () => {
      // config.defaults.mochaOpts.require = await import('./sample.js');
    })();
  }
  config.before = (...args) => {
    install.addHelpers(config);
    if (typeof settings.before === 'function') {
      settings.before(...args);
    }
  };
  return { config };
}
