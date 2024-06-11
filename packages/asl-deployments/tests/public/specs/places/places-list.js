import assert from 'assert';
import { gotoEstablishment } from '../../helpers/establishment.js';

describe('Approved areas directory', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  beforeEach(async() => {
    await gotoEstablishment(await browser, 'University of Croydon');
    await browser.$('a=Approved areas').click();
  });

  it('will filter on the site', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#site-label').click();
    await browser
      .$$('#site-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'The Marquis of Granby Replenishment Centre';
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const sites = await Promise.all(await browser
      .$$('tbody tr td:nth-child(1)')
      .map(td => td.getText()));

    sites.forEach(site =>
      assert.ok(site === 'The Marquis of Granby Replenishment Centre')
    );
  });

  it('will filter on the suitability', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#suitability-label').click();
    await browser
      .$$('#suitability-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'LA';
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const suitability = await Promise.all(await browser
      .$$('tbody tr td:nth-child(4)')
      .map(td => td.getText()));

    suitability.forEach(s => assert.ok(s.includes('LA')));
  });

  it('will filter on the holding', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#holding-label').click();
    await browser
      .$$('#holding-options .govuk-checkboxes__item label')
      .find(async opt => {
        const text = await opt.getText();
        return text.indexOf('SEP') > -1;
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const holdings = await Promise.all(await browser
      .$$('tbody tr td:nth-child(5)')
      .map(td => td.getText()));

    holdings.forEach(h => assert.ok(h.includes('SEP')));
  });

  it('will filter on the site and suitability', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#site-label').click();
    await browser
      .$$('#site-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'The Marquis of Granby Replenishment Centre';
      })
      .click();
    await browser.$('#suitability-label').click();
    await browser
      .$$('#suitability-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'LA';
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const sites = await Promise.all(await browser
      .$$('tbody tr td:nth-child(1)')
      .map(td => td.getText()));
    const suitability = await Promise.all(await browser
      .$$('tbody tr td:nth-child(4)')
      .map(td => td.getText()));

    sites.forEach(site =>
      assert.equal(site, 'The Marquis of Granby Replenishment Centre')
    );
    suitability.forEach(s => assert.ok(s.includes('LA')));
  });

  it('will filter on the site and holding', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#site-label').click();
    await browser
      .$$('#site-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'The Marquis of Granby Replenishment Centre';
      })
      .click();
    await browser.$('#holding-label').click();
    await browser
      .$$('#holding-options .govuk-checkboxes__item label')
      .find(async opt => {
        const text = await opt.getText();
        return text.indexOf('SEP') > -1;
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const sites = await Promise.all(await browser
      .$$('tbody tr td:nth-child(1)')
      .map(td => td.getText()));
    const holdings = await Promise.all(await browser
      .$$('tbody tr td:nth-child(5)')
      .map(td => td.getText()));

    sites.forEach(site =>
      assert.equal(site, 'The Marquis of Granby Replenishment Centre')
    );
    holdings.forEach(h => assert.ok(h.includes('SEP')));
  });

  it('will filter on the suitability and holding', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#suitability-label').click();
    await browser
      .$$('#suitability-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'LA';
      })
      .click();
    await browser.$('#holding-label').click();
    await browser
      .$$('#holding-options .govuk-checkboxes__item label')
      .find(async opt => {
        const text = await opt.getText();
        return text.indexOf('SEP') > -1;
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const suitability = await Promise.all(await browser
      .$$('tbody tr td:nth-child(4)')
      .map(td => td.getText()));
    const holdings = await Promise.all(await browser
      .$$('tbody tr td:nth-child(5)')
      .map(td => td.getText()));

    suitability.forEach(s => assert.ok(s.includes('LA')));
    holdings.forEach(h => assert.ok(h.includes('SEP')));
  });

  it('will filter on the site, suitability and holding', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#site-label').click();
    await browser
      .$$('#site-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'The Marquis of Granby Replenishment Centre';
      })
      .click();
    await browser.$('#suitability-label').click();
    await browser
      .$$('#suitability-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'LA';
      })
      .click();
    await browser.$('#holding-label').click();
    await browser
      .$$('#holding-options .govuk-checkboxes__item label')
      .find(async opt => {
        const text = await opt.getText();
        return text.indexOf('SEP') > -1;
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const sites = await Promise.all(await browser
      .$$('tbody tr td:nth-child(1)')
      .map(td => td.getText()));
    const suitability = await Promise.all(await browser
      .$$('tbody tr td:nth-child(4)')
      .map(td => td.getText()));
    const holdings = await Promise.all(await browser
      .$$('tbody tr td:nth-child(5)')
      .map(td => td.getText()));

    sites.forEach(site =>
      assert.ok(site === 'The Marquis of Granby Replenishment Centre')
    );
    suitability.forEach(s => assert.ok(s.includes('LA')));
    holdings.forEach(h => assert.ok(h.includes('SEP')));
  });

  it('can filter by nacwo', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#nacwos-label').click();
    await browser
      .$$('#nacwos-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'Ian Ayers';
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const nacwos = await Promise.all(await browser
      .$$('tbody tr td:nth-child(6)')
      .map(td => td.getText()));

    nacwos.forEach(nacwo => {
      assert.ok(nacwo.includes('Ian Ayers'));
    });
  });

  it('can filter by nvs', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#nvssqps-label').click();
    await browser
      .$$('#nvssqps-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'Nathan Peters';
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const nvssqps = await Promise.all(await browser
      .$$('tbody tr td:nth-child(7)')
      .map(td => td.getText()));

    nvssqps.forEach(nvssqp => {
      assert.ok(nvssqp.includes('Nathan Peters'));
    });
  });

  it('can filter by nacwo and nvssqps', async() => {
    await browser.$('a=Filter areas').click();
    await browser.$('#nacwos-label').click();
    await browser
      .$$('#nacwos-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'Ian Ayers';
      })
      .click();
    await browser.$('#nvssqps-label').click();
    await browser
      .$$('#nvssqps-options .govuk-checkboxes__item label')
      .find(async opt => {
        return await opt.getText() === 'Nathan Peters';
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    const nacwos = await Promise.all(await browser
      .$$('tbody tr td:nth-child(6)')
      .map(td => td.getText()));

    const nvssqps = await Promise.all(await browser
      .$$('tbody tr td:nth-child(7)')
      .map(td => td.getText()));

    nvssqps.forEach(nvssqp => {
      assert.ok(nvssqp.includes('Nathan Peters'));
    });

    nacwos.forEach(nacwo => {
      assert.ok(nacwo.includes('Ian Ayers'));
    });
  });

  it('can search on name', async() => {
    await browser.$('.search-box input[type="text"]').setValue('33386');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const rows = await browser.$$('table.places-list tbody tr');
    assert.strictEqual(rows.length, 1, 'There should only be a single result');

    const row = rows[0];
    assert.strictEqual(await row.$('td.site').getText(), 'Lunar House 1st floor', 'The site should be correct');
    assert.strictEqual(await row.$('td.area').getText(), '9.66', 'The area should be correct');
    assert.strictEqual(await row.$('td.name a').getText(), '33386', 'The name should be correct');
  });

  it('can search on area', async() => {
    await browser.$('.search-box input[type="text"]').setValue('5.76');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const rows = await browser.$$('table.places-list tbody tr');
    assert.strictEqual(rows.length, 1, 'There should only be a single result');

    const row = rows[0];
    assert.strictEqual(await row.$('td.site').getText(), 'Lunar House 2nd floor', 'The site should be correct');
    assert.strictEqual(await row.$('td.area').getText(), '5.76', 'The area should be correct');
    assert.strictEqual(await row.$('td.name a').getText(), '0', 'The name should be correct');
  });

  it('can search on site', async() => {
    await browser.$('.search-box input[type="text"]').setValue('metro point');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const rows = await browser.$$('table.places-list tbody tr');
    assert.strictEqual(rows.length, 8, 'There should be 8 results');

    await Promise.all(
      [...rows].map(async r => {
        assert.strictEqual(
          await r.$('td.site').getText(),
          'Metro Point',
          'All results should be at Metro Point'
        );
      })
    );
  });

  it('can search on site and filter on holding', async() => {
    await browser.$('.search-box input[type="text"]').setValue('metro point');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    let rows = await browser.$$('table.places-list tbody tr');
    assert.strictEqual(rows.length, 8, 'There should be 8 results');

    await browser.$('a=Filter areas').click();
    await browser.$('#holding-label').click();
    await browser
      .$$('#holding-options .govuk-checkboxes__item label')
      .find(async opt => {
        const text = await opt.getText();
        return text.indexOf('LTH') > -1;
      })
      .click();
    await browser.$('button*=Apply').click();
    await browser.$('table:not(.loading)').waitForExist();

    rows = await browser.$$('table.places-list tbody tr');
    assert.strictEqual(rows.length, 4, 'There should be 4 results');

    await Promise.all([...rows].map(async r => {
      assert.strictEqual(await r.$('td.site').getText(), 'Metro Point', 'All results should be at Metro Point');
      const text = await r.$('td.holding').getText();
      assert.ok(text.includes('LTH'), 'All results should be long term holding');
    }));
  });

  it('it should not return places at other establishments', async() => {
    await browser.$('.search-box input[type="text"]').setValue('cattery');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    let rows = await browser.$$('table.places-list tbody tr');
    assert.strictEqual(rows.length, 0, 'There should no results');

    await gotoEstablishment(await browser, 'Marvell Pharmaceutical');
    await browser.$('a=Approved areas').click();

    await browser.$('.search-box input[type="text"]').setValue('cattery');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    rows = await browser.$$('table.places-list tbody tr');
    assert.strictEqual(rows.length, 1, 'There should 1 result');
  });

  it('renders restrictions icon', async() => {
    assert.ok(await browser.$('a=377').parentElement().$('i.icon-information').isDisplayed());
  });

});
