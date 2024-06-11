import assert from 'assert';

describe('people search', () => {

  before(async () => {
    await browser.withUser('licensing');
  });

  beforeEach(async () => {
    await browser.url('/');
    await browser.$('a=People').click();
  });

  it('shows a people count', async () => {
    const text = await browser.$('h3.filter-summary').getText();
    assert.ok(text.match(/^All [0-9]+ people$/));
  });

  it('can search by first name', async () => {
    await browser.$('.search-box input[type="text"]').setValue('roger');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:first-child').map(td => td.getText());

    assert.ok(results.includes('Roger Dorsett'), 'Roger Dorsett should appear in the search results');
  });

  it('can search by first name with fuzzy matching', async () => {
    await browser.$('.search-box input[type="text"]').setValue('rodger');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:first-child').map(td => td.getText());

    assert.ok(results.includes('Roger Dorsett'), 'Roger Dorsett should appear in the search results');
  });

  it('can search by first name with common synonyms', async () => {
    await browser.$('.search-box input[type="text"]').setValue('rupert');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:first-child').map(td => td.getText());

    assert.ok(results.includes('Roger Dorsett'), 'Roger Dorsett should appear in the search results');
  });

  it('can search by partial first name', async () => {
    await browser.$('.search-box input[type="text"]').setValue('bruc');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:first-child').map(td => td.getText());

    ['Bruce Banner', 'Brucie Attfield'].forEach(name => {
      assert.ok(results.includes(name), `${name} should appear in the search results`);
    });
  });

  it('can search by last name', async () => {
    await browser.$('.search-box input[type="text"]').setValue('holc');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:first-child').map(td => td.getText());

    ['Spare Holc (Croydon Only)', 'Training Holc'].forEach(name => {
      assert.ok(results.includes(name), `${name} should appear in the search results`);
    });
  });

  it('can search by last name with fuzzy matching', async () => {
    await browser.$('.search-box input[type="text"]').setValue('halc');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:first-child').map(td => td.getText());

    ['Spare Holc (Croydon Only)', 'Training Holc'].forEach(name => {
      assert.ok(results.includes(name), `${name} should appear in the search results`);
    });
  });

  it('can search by partial last name', async () => {
    await browser.$('.search-box input[type="text"]').setValue('field');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:first-child').map(td => td.getText());

    ['Brucie Attfield'].forEach(name => {
      assert.ok(results.includes(name), `${name} should appear in the search results`);
    });
  });

  it('can search by email address', async () => {
    await browser.$('.search-box input[type="text"]').setValue('roger.dorsett@example.com');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:nth-child(2)').map(td => td.getText());

    ['roger.dorsett@example.com'].forEach(email => {
      assert.ok(results.includes(email), `${email} should appear in the search results`);
    });
  });

  it('can search by email address with fuzzy matching', async () => {
    await browser.$('.search-box input[type="text"]').setValue('abc1@example.com');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:nth-child(2)').map(td => td.getText());

    ['abc1@example.com', 'abc2@example.com', 'abc5@example.com', 'abc10@example.com'].forEach(email => {
      assert.ok(results.includes(email), `${email} should appear in the search results`);
    });
  });

  it('can search by PIL number', async () => {
    await browser.$('.search-box input[type="text"]').setValue('sn-682317');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:nth-child(3)').map(td => td.getText());

    ['SN-682317'].forEach(pilNumber => {
      assert.ok(results.includes(pilNumber), `${pilNumber} should appear in the search results`);
    });
  });

  it('can search by partial PIL number', async () => {
    await browser.$('.search-box input[type="text"]').setValue('sn-682');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    const results = await browser.$$('.govuk-react-datatable tbody tr td:nth-child(3)').map(td => td.getText());

    ['SN-682317'].forEach(pilNumber => {
      assert.ok(results.includes(pilNumber), `${pilNumber} should appear in the search results`);
    });
  });

  it('can sort by name', async () => {
    await browser.$('th=Name').$('a').click();
    await browser.$('table:not(.loading)').waitForExist();
    assert.equal(await browser.$('tbody tr:first-child td.name').getText(), 'Dagny Aberkirder', 'results should be ordered by surname ascending');

    await browser.$('th=Name').$('a').click();
    await browser.$('table:not(.loading)').waitForExist();
    assert.equal(await browser.$('tbody tr:first-child td.name').getText(), 'Gamaliel Wyburn', 'sort order should be reversed');
  });

});
