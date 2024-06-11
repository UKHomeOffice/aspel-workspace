import assert from 'assert';
import { gotoEstablishment } from '../../helpers/establishment.js';

describe('People directory', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  it('will link to the profile page if a name link is clicked', async() => {
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=People').click();
    await browser.$('a=Dagny Aberkirder').click();

    assert.ok(await browser.$('h1=Dagny Aberkirder').isDisplayed());
  });

  it('will filter to a particular role', async() => {
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=People').click();

    await browser.$('.link-filter').$('a=NACWO').click();

    await browser.$('table:not(.loading)').waitForExist();

    const roles = await Promise.all(await browser
      .$$('tbody tr td.roles')
      .map(td => td.getText()));

    roles.forEach(role => assert.ok(role.includes('NACWO')));
  });

  it('will filter on the name', async() => {
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=People').click();

    await browser.$('.search-box input[type="text"]').setValue('Laur');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const names = await Promise.all(await browser
      .$$('tbody tr td.name')
      .map(td => td.getText()));

    names.forEach(name => assert.ok(name.includes('Laur')));
  });

  it('will ignore accented characters when filtering names', async() => {
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=People').click();

    await browser.$('.search-box input[type="text"]').setValue('hasno pil');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('td=Hasnø Pil').isDisplayed());
  });

  it('will ignore apostrophes when filtering names', async() => {
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=People').click();

    // do search without apostrophe
    await browser.$('.search-box input[type="text"]').setValue(`helen onowlan`);
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$(`td=Helen O'Nowlan`).isDisplayed());

    // reset search - for reasons I cannot fathon using `clearValue` or `setValue('')` doesn't work
    await browser.$('.search-box input[type="text"]').setValue('zzzzzzzz');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(!await browser.$(`td=Helen O'Nowlan`).isDisplayed());

    // do search with apostrophe
    await browser.$('.search-box input[type="text"]').setValue(`helen o'nowlan`);
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$(`td=Helen O'Nowlan`).isDisplayed());
  });

  it('will ignore hyphens when filtering names', async() => {
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=People').click();

    // do search without hyphen
    await browser.$('.search-box input[type="text"]').setValue(`basic small pharma`);
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$(`td=Basic Small-Pharma`).isDisplayed());

    // reset search - for reasons I cannot fathon using `clearValue` or `setValue('')` doesn't work
    await browser.$('.search-box input[type="text"]').setValue('zzzzzzzz');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(!await browser.$(`td=Basic Small-Pharma`).isDisplayed());

    // do search with hyphen
    await browser.$('.search-box input[type="text"]').setValue(`basic small-pharma`);
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$(`td=Basic Small-Pharma`).isDisplayed());
  });

  it('will filter to a particular role and name', async() => {
    await gotoEstablishment(browser, 'University of Croydon');
    await browser.$('a=People').click();

    await browser
      .$('.link-filter')
      .$('a=NACWO')
      .click();

    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('.search-box input[type="text"]').setValue('b');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const names = await Promise.all(await browser
      .$$('tbody tr td.name')
      .map(td => td.getText()));

    const roles = await Promise.all(await browser
      .$$('tbody tr td.roles')
      .map(td => td.getText()));

    roles.forEach(role =>
      assert.ok(role.includes('NACWO'), `${role} should contain 'NACWO'`)
    );
    names.forEach(name =>
      assert.ok(name.toLowerCase().includes('b'), `${name} should contain 'b'`)
    );
  });
});
