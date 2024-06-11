import assert from 'assert';
import { gotoEstablishment } from '../../helpers/establishment.js';

const gotoApprovedAreasList = async browser => {
  await gotoEstablishment(browser, 'University of Croydon');
  await browser.$('a=Approved areas').click();
  await browser.$('h1=Approved areas').waitForDisplayed();
};

describe('Assigned named people', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  it('are displayed in the schedule of premises', async() => {
    await gotoApprovedAreasList(browser);
    const nacwos = await browser.$('//tbody/tr[1]/td[@class="nacwos"]').getText();
    assert(nacwos.includes('Ian Ayers'));
  });

  it('nacwo name links to profile page', async() => {
    await gotoApprovedAreasList(browser);
    await browser.$('tbody tr:first-child td.nacwos a').click();
    assert.equal(await browser.$('h1').getText(), 'Ian Ayers');
  });

  it('can assign a nacwo without ASRU approval', async() => {
    await gotoApprovedAreasList(browser);
    await browser.$('a=1603').click();
    assert.ok(await browser.$('dd=Ian Ayers').isDisplayed(), 'existing NACWO should be displayed');

    await browser.$('a=Amend area').click();
    await browser.$('button=Add NACWO').click();

    await browser.$$('select[name="nacwos"]')[1].selectByVisibleText('Brian Proudfoot');
    await browser.$('button=Continue').click();
    await browser.$('label[for*="declaration-true"]').click();
    await browser.$('button=Submit').click();

    assert.ok(await browser.$('h1=Approved').isDisplayed(), 'NACWO assignment should be immediately automatically resolved');

    await gotoApprovedAreasList(browser);
    const nacwos = await browser.$('//a[text()="1603"]/ancestor::tr/td[@class="nacwos"]').getText();

    ['Ian Ayers', 'Brian Proudfoot'].forEach(name => {
      assert.ok(nacwos.includes(name), `${name} should be listed as a NACWO in the places list`);
    });
  });

  it('can remove all nacwos without ASRU approval', async() => {
    await gotoApprovedAreasList(browser);
    await browser.$('a=1603').click();

    await browser.$('a=Amend area').click();
    await browser.$('a=Remove NACWO').click();
    await browser.$('a=Remove NACWO').click();
    await browser.$('button=Continue').click();
    await browser.$('label[for*="declaration-true"]').click();
    await browser.$('button=Submit').click();

    assert.ok(await browser.$('h1=Approved').isDisplayed(), 'NACWO removal should be immediately automatically resolved');

    await gotoApprovedAreasList(browser);
    const nacwos = await browser.$('//a[text()="1603"]/ancestor::tr/td[@class="nacwos"]').getText();
    assert.strictEqual(nacwos, '', 'there should be no nacwos remaining on the place');
  });
});
