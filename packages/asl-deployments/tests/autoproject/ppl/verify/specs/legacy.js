import assert from 'assert';

describe('PPL Verify', async () => {

  it('can see granted PPL content', async () => {
    await browser.withUser('holc');
    await browser.gotoEstablishment();
    await browser.$('a=Projects').click();

    await browser.$('.search-box input[type="text"]').setValue(process.env.PROJECT_TITLE);
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$(`a=${process.env.PROJECT_TITLE}`).click();
    await browser.$('=View licence').click();

    const pdf = await browser.downloadFile('pdf');

    assert.ok(pdf.includes(process.env.PROJECT_TITLE), 'Project title is displayed');
    assert.ok(pdf.includes('Auto Project'), 'Licence holder name is displayed');
    assert.ok(pdf.includes('University of Croydon'), 'Primary establishment name is displayed');

    assert.ok(pdf.includes('Standard conditions'), 'Standard conditions section is displayed');

    assert.ok(pdf.includes('Additional custom condition'), 'Custom condition is displayed');

    assert.ok(pdf.includes('Protocol 1 title'), 'First protocol title is displayed');
    assert.ok(pdf.includes('Protocol 2 title'), 'Second protocol title is displayed');
  });

  it('can download NTS', async () => {
    await browser.gotoEstablishment();
    await browser.$('a=Projects').click();

    await browser.$('.search-box input[type="text"]').setValue(process.env.PROJECT_TITLE);
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$(`a=${process.env.PROJECT_TITLE}`).click();
    await browser.$('a=Non-technical summary').click();

    const nts = await browser.downloadFile('nts');

    assert.ok(nts.includes('keyword-0, keyword-1, keyword-2, keyword-3, keyword-4'));
  });

  it('admin at additional establishment can see project', async () => {
    await browser.withUser('pharmaadmin');

    await browser.gotoEstablishment('Marvell Pharmaceutical');

    await browser.$('a=Projects').click();

    await browser.$('.search-box input[type="text"]').setValue(process.env.PROJECT_TITLE);
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$(`a=${process.env.PROJECT_TITLE}`).click();
    await browser.$('=View licence').click();
    assert.ok(await browser.$(`h2=${process.env.PROJECT_TITLE}`).isDisplayed());
  });

});
