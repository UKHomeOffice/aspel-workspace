import assert from 'assert';

describe('Enforcement search', () => {
  beforeEach(async () => {
    await browser.withUser('inspector');
    await browser.$('a=Enforcement cases').click();
  });

  it('can search by establishment', async () => {
    const unfilteredResults = await browser.$$('a=View case').length;
    await browser.$('input[name="filter"]').setValue('Tiny Pharma');
    await browser.$('button[type="submit"]').click();
    await browser.$('table:not(.loading)').waitForExist();
    const filteredResults = await browser.$$('a=View case').length;
    assert.ok(filteredResults < unfilteredResults);
    assert.ok(await browser.$('td=Tiny Pharma').isDisplayed());
  });

  it('can search by establishment keyword', async () => {
    const unfilteredResults = await browser.$$('a=View case').length;
    await browser.$('input[name="filter"]').setValue('UofC');
    await browser.$('button[type="submit"]').click();
    await browser.$('table:not(.loading)').waitForExist();
    const filteredResults = await browser.$$('a=View case').length;
    assert.ok(filteredResults < unfilteredResults);
    assert.ok(await browser.$('td=University of Croydon').isDisplayed());
  });

  it('can search by case number', async () => {
    await browser.$('input[name="filter"]').setValue(10010);
    await browser.$('button[type="submit"]').click();
    await browser.$('table:not(.loading)').waitForExist();
    const filteredResults = await browser.$$('a=View case').length;
    assert.ok(filteredResults === 1);
    assert.ok(await browser.$('span=No subjects with ongoing or closed enforcement flags').isDisplayed());
  });

  it('can search by PIL licence number', async () => {
    await browser.$('input[name="filter"]').setValue('EZ-243280');
    await browser.$('button[type="submit"]').click();
    await browser.$('table:not(.loading)').waitForExist();
    const filteredResults = await browser.$$('a=View case').length;
    assert.ok(filteredResults === 1);
    assert.ok(await browser.$('a=PIL: EZ-243280').isDisplayed());
  });

  it('can search by PPL licence number', async () => {
    await browser.$('input[name="filter"]').setValue('ENF-OPEN-1');
    await browser.$('button[type="submit"]').click();
    await browser.$('table:not(.loading)').waitForExist();
    const filteredResults = await browser.$$('a=View case').length;
    assert.ok(filteredResults === 1);
    assert.ok(await browser.$('a=PPL: ENF-OPEN-1').isDisplayed());
  });

  it('can search by PEL licence number', async () => {
    await browser.$('input[name="filter"]').setValue('NO-PILS-NO-PPLS');
    await browser.$('button[type="submit"]').click();
    await browser.$('table:not(.loading)').waitForExist();
    const filteredResults = await browser.$$('a=View case').length;
    assert.ok(filteredResults === 1);
    assert.ok(await browser.$('a=PEL: NO-PILS-NO-PPLS').isDisplayed());
  });

  it('can search by profile', async () => {
    await browser.$('input[name="filter"]').setValue('Gerry Joseland');
    await browser.$('button[type="submit"]').click();
    await browser.$('table:not(.loading)').waitForExist();
    const filteredResults = await browser.$$('a=View case').length;
    assert.ok(filteredResults === 1);
    assert.ok(await browser.$('td=Gerry Joseland').isDisplayed());
  });
});
