require('dotenv/config');

module.exports = {
  specs: './tests/functional/specs/**/*.js',
  users: {
    'inspector': 'inspector'
  },
  urls: {
    local: 'http://localhost:8080',
    dev: 'https://inspector-ui.notprod.asl.homeoffice.gov.uk',
    preprod: 'https://inspector-ui.preprod.asl.homeoffice.gov.uk'
  },
  wdio: {
    suites: {
      smoke: ['./tests/functional/specs/smoke-tests.js']
    }
  },
  screenshots: {
    user: 'inspector',
    urls: [
      '/',
      '/establishment/8201',
      '/establishment/8201/details',
      '/establishment/8201/places'
    ],
    // uncomment to save local screenshots
    // path: './tests/functional/screenshots',
    s3: {
      region: 'eu-west-2',
      bucket: 'asl-screenshots',
      prefix: 'internal-ui',
      accessKey: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET
    }
  }
};
