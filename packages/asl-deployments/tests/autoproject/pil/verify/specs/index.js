import assert from 'assert';

describe('PIL Verify', () => {
  it('can see granted PIL content', async () => {
    await browser.withUser('holc');
    await browser.gotoEstablishment();
    await browser.$('a=People').click();

    await browser.$('.search-box input[type="text"]').setValue('Auto Project');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('a=Auto Project').click();
    await browser.$('a[href*="/pil/"]').click();

    const pdf = await browser.downloadFile('pdf');

    assert.ok(await pdf.includes('Auto Project'), 'Licence holder name is displayed');
    assert.ok(await pdf.includes('University of Croydon'), 'Primary establishment name is displayed');

    ['Mice', 'Rats', 'Jabu', 'Babu'].forEach(async (type) => {
      assert.ok(await pdf.includes(type), `${type} is displayed`);
    });

    assert.ok(await pdf.includes('Category F type of procedure'), 'Cat F type displayed');
  });
});
