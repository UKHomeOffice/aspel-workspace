const assert = require('assert');

describe('Licensed premises directory', () => {
  it('will filter on the site', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('a=Licensed premises');
    browser.$('a=Filter by').click();
    browser
      .$$('#site-options .multiple-choice label')
      .find(opt => {
        return opt.getText() === 'The Marquis of Granby Replenishment Centre';
      })
      .click();
    browser.click('button*=Apply');
    browser.waitForExist('table:not(.loading)');

    const sites = browser
      .$$('tbody tr td:nth-child(1)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    sites.forEach(site =>
      assert.ok(site === 'The Marquis of Granby Replenishment Centre')
    );
  });

  it('will filter on the suitability', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('a=Licensed premises');
    browser.$('a=Filter by').click();
    browser
      .$$('#suitability-options .multiple-choice label')
      .find(opt => {
        return opt.getText() === 'LA';
      })
      .click();
    browser.click('button*=Apply');
    browser.waitForExist('table:not(.loading)');

    const suitability = browser
      .$$('tbody tr td:nth-child(4)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    suitability.forEach(s => assert.ok(s.includes('LA')));
  });

  it('will filter on the holding', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('a=Licensed premises');
    browser.$('a=Filter by').click();
    browser
      .$$('#holding-options .multiple-choice label')
      .find(opt => {
        return opt.getText().indexOf('SEP') > -1;
      })
      .click();
    browser.click('button*=Apply');
    browser.waitForExist('table:not(.loading)');

    const holdings = browser
      .$$('tbody tr td:nth-child(5)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    holdings.forEach(h => assert.ok(h.includes('SEP')));
  });

  it('will filter on the site and suitability', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('a=Licensed premises');
    browser.$('a=Filter by').click();
    browser
      .$$('#site-options .multiple-choice label')
      .find(opt => {
        return opt.getText() === 'The Marquis of Granby Replenishment Centre';
      })
      .click();
    browser
      .$$('#suitability-options .multiple-choice label')
      .find(opt => {
        return opt.getText() === 'LA';
      })
      .click();
    browser.click('button*=Apply');
    browser.waitForExist('table:not(.loading)');

    const sites = browser
      .$$('tbody tr td:nth-child(1)')
      .map(td => browser.elementIdText(td.ELEMENT).value);
    const suitability = browser
      .$$('tbody tr td:nth-child(4)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    sites.forEach(site =>
      assert.ok(site == 'The Marquis of Granby Replenishment Centre')
    );
    suitability.forEach(s => assert.ok(s.includes('LA')));
  });

  it('will filter on the site and holding', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('a=Licensed premises');
    browser.$('a=Filter by').click();
    browser
      .$$('#site-options .multiple-choice label')
      .find(opt => {
        return opt.getText() === 'The Marquis of Granby Replenishment Centre';
      })
      .click();
    browser
      .$$('#holding-options .multiple-choice label')
      .find(opt => {
        return opt.getText().indexOf('SEP') > -1;
      })
      .click();
    browser.click('button*=Apply');
    browser.waitForExist('table:not(.loading)');

    const sites = browser
      .$$('tbody tr td:nth-child(1)')
      .map(td => browser.elementIdText(td.ELEMENT).value);
    const holdings = browser
      .$$('tbody tr td:nth-child(5)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    sites.forEach(site =>
      assert.ok(site == 'The Marquis of Granby Replenishment Centre')
    );
    holdings.forEach(h => assert.ok(h.includes('SEP')));
  });

  it('will filter on the suitability and holding', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('a=Licensed premises');
    browser.$('a=Filter by').click();
    browser
      .$$('#suitability-options .multiple-choice label')
      .find(opt => {
        return opt.getText() === 'LA';
      })
      .click();
    browser
      .$$('#holding-options .multiple-choice label')
      .find(opt => {
        return opt.getText().indexOf('SEP') > -1;
      })
      .click();
    browser.click('button*=Apply');
    browser.waitForExist('table:not(.loading)');

    const suitability = browser
      .$$('tbody tr td:nth-child(4)')
      .map(td => browser.elementIdText(td.ELEMENT).value);
    const holdings = browser
      .$$('tbody tr td:nth-child(5)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    suitability.forEach(s => assert.ok(s.includes('LA')));
    holdings.forEach(h => assert.ok(h.includes('SEP')));
  });

  it('will filter on the site, suitability and holding', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('a=Licensed premises');
    browser.$('a=Filter by').click();
    browser
      .$$('#site-options .multiple-choice label')
      .find(opt => {
        return opt.getText() === 'The Marquis of Granby Replenishment Centre';
      })
      .click();
    browser
      .$$('#suitability-options .multiple-choice label')
      .find(opt => {
        return opt.getText() === 'LA';
      })
      .click();
    browser
      .$$('#holding-options .multiple-choice label')
      .find(opt => {
        return opt.getText().indexOf('SEP') > -1;
      })
      .click();
    browser.click('button*=Apply');
    browser.waitForExist('table:not(.loading)');

    const sites = browser
      .$$('tbody tr td:nth-child(1)')
      .map(td => browser.elementIdText(td.ELEMENT).value);
    const suitability = browser
      .$$('tbody tr td:nth-child(4)')
      .map(td => browser.elementIdText(td.ELEMENT).value);
    const holdings = browser
      .$$('tbody tr td:nth-child(5)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    sites.forEach(site =>
      assert.ok(site === 'The Marquis of Granby Replenishment Centre')
    );
    suitability.forEach(s => assert.ok(s.includes('LA')));
    holdings.forEach(h => assert.ok(h.includes('SEP')));
  });
});
