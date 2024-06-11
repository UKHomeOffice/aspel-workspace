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

    // RA is required because marmosets
    assert.ok(await browser.$(`p=The Secretary of State has determined that a retrospective assessment of this licence is required, and should be submitted within 6 months of the licence's revocation date.`).isDisplayed());

    const pdf = await browser.downloadFile('pdf');

    assert.ok(pdf.includes(process.env.PROJECT_TITLE), 'Project title is displayed');
    assert.ok(pdf.includes('Auto Project'), 'Licence holder name is displayed');
    assert.ok(pdf.includes('University of Croydon'), 'Primary establishment name is displayed');

    assert.ok(pdf.includes('General constraints'), 'General constraints section is displayed');
    assert.ok(pdf.includes('Standard conditions'), 'Standard conditions section is displayed');

    assert.ok(pdf.includes('Protocol 1 title'), 'First protocol title is displayed');
    assert.ok(pdf.includes('Protocol 2 title'), 'Second protocol title is displayed');

    // conditions
    [
      'Marmosets',
      'Animals taken from the wild',
      'POLEs',
      'Non purpose bred schedule 2 animals',
      'Establishment licences not meeting Code of Practice',
      'Batch testing',
      'Neuromuscular blocking agents (NMBAs)'
    ].forEach(condition => {
      assert.ok(pdf.includes(condition), `PDF should contain condition: "${condition}"`);
    });

    const removedConditionText = 'Standard condition 13(a) of this licence shall not apply';
    assert.ok(!pdf.includes(removedConditionText));

    const amendedConditions = 'Standard condition 13(b) of this licence shall not apply in cases when mice bred for use in procedures are not suitable for the purpose of the programme of work specified in the licence as justified in the project licence application.';
    assert.ok(pdf.includes(amendedConditions));

    const customProtocolConditions = 'Custom condition protocol 1';
    assert.ok(pdf.includes(customProtocolConditions));
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
