const defaults = require('./defaults');
const ci = require('./ci');

const env = () => {
  return process.env.DRONE_DEPLOY_TO || process.env.TEST_ENV || (process.env.CI ? 'dev' : 'local');
}

const url = () => {
  if (env() === 'local') {
    return `http://localhost:8080`;
  }
  return `https://${env()}.notprod.asl.homeoffice.gov.uk`;
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
