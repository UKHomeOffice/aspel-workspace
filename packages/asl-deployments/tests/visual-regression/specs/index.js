const fs = require('fs');
const path = require('path');
const assert = require('assert');
const filenamify = require('filenamify');

const urls = [
  '/',
  '/establishments/8201',
  '/establishments/8201/details',
  '/establishments/8201/places',
  '/establishments/8201/people',
  '/establishments/8201/pils',
  '/establishments/8201/projects',
  '/establishments/8201/licence-fees',
  '/account',
  '/account/edit',
  '/account/update-email',
  '/account/update-password'
];

const internalUrls = [
  '/',
  '/reporting',
  '/licence-fees',
  '/downloads',
  '/search/establishments',
  '/search/profiles',
  '/search/projects',
  '/search/projects-content',
  '/rops'
];

const hiddenElementSelector = [
  'td.updatedAt',
  'td.createdAt',
  'span.date',
  'input.bpk-datepicker__input',
  '.task-status .deadline-passed'
].join();

// load journeys by iterating over files in the ./journeys directory
const journeys = fs.readdirSync(path.resolve(__dirname, './journeys'))
  .reduce((obj, file) => {
    if (path.extname(file) !== '.js') {
      return obj;
    }
    const key = path.basename(file, '.js');
    return { ...obj, [key]: require(path.resolve(__dirname, './journeys', key)) };
  }, {});

const getFileName = url => {
  if (url === '/') {
    return 'dashboard';
  }
  return filenamify(url, {replacement: '-'});
};

describe('visual regression', () => {

  before(() => {
    browser.setWindowSize(1440, 800);
  });

  describe('static external urls', () => {

    before(() => {
      browser.withUser('holc');
    });

    urls.forEach(url => {
      it(`${url}`, () => {
        browser.url(url);
        const hidden = browser.$$(hiddenElementSelector);
        assert.equal(browser.checkFullPageScreen(getFileName(url), {
          hideScrollBars: true,
          hideElements: [
            ...hidden
          ]
        }), 0);
      });
    });

  });

  describe('static internal urls', () => {

    before(() => {
      browser.withUser('asrusuper');
    });

    internalUrls.forEach(url => {
      it(`${url}`, () => {
        browser.url(url);
        const hidden = browser.$$(hiddenElementSelector);
        assert.equal(browser.checkFullPageScreen(`internal-${getFileName(url)}`, {
          hideScrollBars: true,
          hideElements: [
            ...hidden
          ]
        }), 0);
      });
    });

  });

  describe('journeys', () => {

    Object.keys(journeys).forEach(key => {
      it(`${key}`, () => {
        let diffs = 0;
        journeys[key].forEach((fn, i) => {
          fn();
          browser.waitForSync();
          const hidden = browser.$$(hiddenElementSelector);
          diffs += browser.checkFullPageScreen(`${key}-step-${i + 1}`, {
            hideScrollBars: true,
            hideElements: [
              ...hidden
            ]
          });
        });
        assert.equal(diffs, 0);
      });
    });

  });

});
