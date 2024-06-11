import assert from 'assert';

describe('establishment search', () => {

  before(async () => {
    await browser.withUser('licensing');
  });

  beforeEach(async () => {
    await browser.url('/');
    await browser.$('a=Establishments').click();
  });

  it('can search establishments', async () => {
    await browser.$('.search-box input[type="text"]').setValue('croydon');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const rows = await browser.$$('.govuk-react-datatable tbody tr');
    const text = await browser.$('.govuk-react-datatable tbody tr td:first-child').getText();

    assert.equal(rows.length, 1, '1 row should be visible in search results');
    assert.equal(text, 'University of Croydon');
  });

  it('can search establishments by keyword', async () => {
    await browser.$('.search-box input[type="text"]').setValue('mvp');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const rows = await browser.$$('.govuk-react-datatable tbody tr');
    const text = await browser.$('.govuk-react-datatable tbody tr td:first-child').getText();

    assert.equal(rows.length, 1, '1 row should be visible in search results');
    assert.match(text, /Marvell Pharmaceutical/);
  });

  it('can filter an active search term and then clear the term leaving the filter active', async () => {
    await browser.$('.search-box input[type="text"]').setValue('croydon');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('a=Draft').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.equal(await browser.$('.search-box input[type="text"]').getValue(), 'croydon', 'the search term should be persisted');
    assert.equal(await browser.$$('.govuk-react-datatable tbody tr').length, 0, 'no rows should be visible in search results');

    await browser.$('a=Clear search').click();
    await browser.$('table:not(.loading)').waitForExist();
    assert.equal(await browser.$('.search-box input[type="text"]').getValue(), '', 'the search term should be empty');
    assert.ok(await browser.$$('.govuk-react-datatable tbody tr').length > 0, 'there should be some draft establishment results');
    const tds = await browser.$$('.govuk-react-datatable tbody tr td.status');
    for (const td of tds) {
      const tdText = await td.getText();
      assert.equal(tdText, 'DRAFT');
    }
  });

  it('shows only active establishments by default', async () => {
    const texts = await browser.$$('.govuk-react-datatable tbody tr td:first-child')
      .map(td => td.getText());

    assert.ok(!texts.includes('Big Pharma'));
    assert.ok(texts.find(text => text.startsWith('Marvell Pharmaceutical')));
    const tds = await browser.$$('.govuk-react-datatable tbody tr td.status');
    for (const td of tds) {
      const text = await td.getText();
      assert(text === 'ACTIVE' || text === 'SUSPENDED', `status should be ACTIVE OR SUSPENDED, was: ${text}`);
    }
  });

  it('can filter to revoked establishments', async () => {
    await browser.$('a=Revoked').click();

    await browser.$('table:not(.loading)').waitForExist();

    const tds = await browser.$$('.govuk-react-datatable tbody tr td.status');
    for (const td of tds) {
      const text = await td.getText();
      assert.equal(text, 'REVOKED');
    }
  });

  it('summary label changes to "all x establishments" when "Show all" is clicked', async () => {
    await browser.$('a=Show all').click();
    await browser.$('table:not(.loading)').waitForExist();

    const text = await browser.$('h3.filter-summary').getText();
    assert.ok(text.match(/^All [0-9]+ establishments$/));
  });

});
