const defaults = require('./defaults');
const ci = require('./ci');

const env = () => {
  return process.env.DRONE_DEPLOY_TO || process.env.TEST_ENV || (process.env.CI ? 'dev' : 'local');
}

const url = () => {
  const urls = {
    local: 'http://localhost:8080',
    dev: 'https://public-ui.notprod.asl.homeoffice.gov.uk',
    preprod: 'https://public-ui.preprod.asl.homeoffice.gov.uk'
  };
  return urls[env()];
};

const config = () => {
  if (process.env.CI) {
    return ci;
  }
  return {};
};

exports.config = Object.assign({
  baseUrl: url()
}, defaults, config());
