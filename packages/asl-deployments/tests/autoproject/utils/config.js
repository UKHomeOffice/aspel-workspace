import path, { dirname } from 'path';
import { helpers } from '../../module/index.js';
import screenShotOnFail from '../../helpers/screenshot-on-fail.js';
import install from './install.js';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function (specs, env) {

  const urls = {
    local: 'http://localhost:8080',
    dev: 'https://public-ui.dev.asl.homeoffice.gov.uk',
    preprod: 'https://public-ui.preprod.asl.homeoffice.gov.uk'
  };

  if (env === 'internal') {
    Object.assign(urls, {
      local: 'http://localhost:8085',
      dev: 'https://internal-ui.dev.asl.homeoffice.gov.uk',
      preprod: 'https://internal-ui.preprod.asl.homeoffice.gov.uk'
    });
  }

  return helpers.config({
    specs: [ specs ],
    users: {
      'autoproject': process.env.KEYCLOAK_PASSWORD,
      'holc': process.env.KEYCLOAK_PASSWORD,
      'ntco': process.env.KEYCLOAK_PASSWORD,
      'basic': process.env.KEYCLOAK_PASSWORD,
      'licensing': process.env.KEYCLOAK_PASSWORD,
      'inspector': process.env.KEYCLOAK_PASSWORD,
      'pharmaadmin': process.env.KEYCLOAK_PASSWORD
    },
    urls,
    sample: false,
    flags: ['--whitelisted-ips', '--disable-dev-shm-usage'],
    before: () => install(),
    services: [
      [
        'image-comparison',
        {
          screenshotPath: path.resolve(__dirname, '../../')
        }
      ]
    ],
    afterTest: screenShotOnFail,
    afterHook: screenShotOnFail
  });

}
