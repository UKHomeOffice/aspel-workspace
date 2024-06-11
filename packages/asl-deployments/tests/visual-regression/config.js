const path = require('path');
const { helpers } = require('../module');
const saveResults = require('./lib/save-results');

module.exports = helpers.config({
  specs: [
    `${__dirname}/specs/**/*.js`
  ],
  urls: {
    local: 'http://localhost:8080',
    dev: 'https://public-ui.dev.asl.homeoffice.gov.uk',
    preprod: 'https://public-ui.preprod.asl.homeoffice.gov.uk'
  },
  flags: ['--force-device-scale-factor=1'],
  after: failures => {
    console.log(`${failures} test failures detected.`);
    if (failures) {
      return saveResults()
        .catch(e => {
          console.error(e.stack);
        });
    }
  },
  reporters: ['spec'],
  services: [
    [
      'image-comparison',
      {
        autoSaveBaseline: true,
        baselineFolder: path.resolve(__dirname, './baseline'),
        screenshotPath: path.resolve(__dirname, './')
      }
    ]
  ]
});
