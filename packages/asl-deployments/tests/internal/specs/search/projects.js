import assert from 'assert';

describe('project search', () => {

  before(async () => {
    await browser.withUser('licensing');
  });

  beforeEach(async () => {
    await browser.url('/');
    await browser.$('a=Projects').click();
  });

  it('can search active projects', async () => {
    await browser.$('a=Active').click();
    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('.search-box input[type="text"]').setValue('oncolytic');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const names = await browser.$$('.govuk-react-datatable tbody tr td:first-child')
      .map(td => td.getText());

    await names.forEach(name => assert(name.toLowerCase().includes('oncolytic')));

    const tds = await browser.$$('.govuk-react-datatable tbody tr td.status');
    for (const td of tds) {
      const tdText = await td.getText();
      assert.equal(tdText.toLowerCase(), 'active');
    }
  });

  it('searches all projects by default', async () => {
    await browser.$('.search-box input[type="text"]').setValue('oncolytic');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const names = await browser.$$('.govuk-react-datatable tbody tr td:first-child')
      .map(td => td.getText());

    names.forEach(name => assert(name.toLowerCase().includes('oncolytic')));
  });

  it('can filter draft projects', async () => {
    await browser.$('a=Draft').click();

    await browser.$('table:not(.loading)').waitForExist();

    const tds = await browser.$$('.govuk-react-datatable tbody tr td.status');
    for (const td of tds) {
      const tdText = await td.getText();
      assert.equal(tdText.toLowerCase(), 'draft');
    }
  });

  it('can filter an active search term and then clear the term leaving the filter active', async () => {
    await browser.$('.search-box input[type="text"]').setValue('protocols');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('a=Draft').click();
    await browser.$('table:not(.loading)').waitForExist();

    const draftsMatchingTerm = await browser.$$('.govuk-react-datatable tbody tr td.status');
    assert.equal(await browser.$('.search-box input[type="text"]').getValue(), 'protocols', 'the search term should be persisted');
    for (const td of draftsMatchingTerm) {
      const tdText = await td.getText();
      assert.equal(tdText, 'DRAFT', 'all rows should be draft');
    }

    await browser.$('a=Clear search').click();
    await browser.$('table:not(.loading)').waitForExist();

    const draftsNoTerm = await browser.$$('.govuk-react-datatable tbody tr td.status');
    assert.equal(await browser.$('.search-box input[type="text"]').getValue(), '', 'the search term should be empty');
    for (const td of draftsNoTerm) {
      const tdText = await td.getText();
      assert.equal(tdText, 'DRAFT', 'all rows should still be draft');
    }
    assert.ok(draftsNoTerm.length > draftsMatchingTerm.length, 'clearing the search term should match more results');
  });

  it('shows correct project count', async () => {
    const text = await browser.$('h3.filter-summary').getText();
    assert.ok(text.match(/^All [0-9]+ projects$/));
  });

  it('shows correct status on revoked projects (regression)', async () => {
    await browser.$('.search-box input[type="text"]').setValue('revoked project');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const tdStatus = await browser.$('//tr[normalize-space(td[@class="title"]/a/p)="Revoked project"]/td[@class="status"]');
    const status = await tdStatus.getText();

    assert.equal(status, 'REVOKED');
  });

});
