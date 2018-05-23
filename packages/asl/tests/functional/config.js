require('dotenv/config');

module.exports = env => ({
  specs: './tests/functional/specs/**/*.js',
  users: {
    'holc': 'holc'
  },
  urls: {
    local: 'http://localhost:8080',
    dev: 'https://public-ui.notprod.asl.homeoffice.gov.uk',
    preprod: 'https://public-ui.preprod.asl.homeoffice.gov.uk'
  },
  wdio: {
    suites: {
      smoke: ['./tests/functional/specs/smoke-tests.js']
    }
  },
  screenshots: env !== 'local' && {
    user: 'holc',
    urls: [
      '/',
      '/places',
      '/people',
      '/details'
    ],
    // uncomment to save local screenshots
    // path: './tests/functional/screenshots',
    s3: {
      region: 'eu-west-2',
      bucket: 'asl-screenshots',
      prefix: 'public-ui',
      accessKey: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET
    }
  }
});
