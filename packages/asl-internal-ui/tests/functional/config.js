require('dotenv/config');

module.exports = {
  specs: './tests/functional/specs/**/*.js',
  users: {
    'licensing': 'licensing',
    'inspector': 'inspector'
  },
  urls: {
    local: 'http://localhost:8086',
    dev: 'https://inspector-ui.notprod.asl.homeoffice.gov.uk',
    preprod: 'https://inspector-ui.preprod.asl.homeoffice.gov.uk'
  },
  wdio: {
    suites: {
      smoke: ['./tests/functional/specs/smoke-tests.js']
    }
  }
};
