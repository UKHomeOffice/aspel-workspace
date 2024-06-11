import assert from 'assert';

describe('project search', () => {

  before(async () => {
    await browser.withUser('licensing');
  });

  beforeEach(async () => {
    await browser.url('/');
    await browser.$('a=Projects').click();
    await browser.$('a=Search all projects for specific terms').click();
  });

  it('ignores punctuation in matching content', async () => {
    await browser.$('.search-box input[type="text"]').setValue('vegetable animal and mineral');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    assert.ok(await browser.$('a=Content search test').isDisplayed());
  });

  it('links to the relevant section of the application', async () => {
    await browser.$('.search-box input[type="text"]').setValue('vegetable animal and mineral');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    assert.ok(await browser.$('a=Protocol - First protocol title').isDisplayed());
    await browser.$('a=Protocol - First protocol title').click();

    assert.ok(await browser.$('h1=Protocols').isDisplayed());
  });

  it('should match project titles for complete term (regression)', async () => {
    await browser.$('.search-box input[type="text"]').setValue('active project');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(!await browser.$('a=Revoked project').isExisting(), 'titles matching only part of the term should not be returned');
  });

  it('highlights matches in project titles', async () => {
    await browser.$('.search-box input[type="text"]').setValue('active');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('a=Active project').isDisplayed());
    assert.ok(await browser.$('a=Active project').$('strong=Active').isDisplayed());
  });

  it('can search projects filtered by status', async () => {
    await browser.$('summary=Project status').click();
    await browser.$('label=Active projects').click();
    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('.search-box input[type="text"]').setValue('revoked project');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(!await browser.$('a=Revoked project').isExisting(), 'only titles matching the filter should be shown');

    await browser.$('label=Active projects').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('label=Revoked projects').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('a=Revoked project').isExisting(), 'title matching filter should be shown');
  });

  it('can search projects filtered by animal types', async () => {
    await browser.$('summary=Animal type').click();
    await browser.$('label=Beagles').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('a=RA due multiple reasons (dogs, severe)').isExisting(), 'project including beagles shoule be included');
  });

  it('search content from specific sets of fields', async () => {
    await browser.$('summary=Document type').click();
    await browser.$('label=NTSs and RAs').click();
    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('.search-box input[type="text"]').setValue('This term appears in the full application');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(!await browser.$('a=Content search - application').isExisting());

    await browser.$('.search-box input[type="text"]').setValue('This term appears in the NTS');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('a=Content search - NTS').isExisting());

    await browser.$('label=NTSs and RAs').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('label=Licences').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(!await browser.$('a=Content search - NTS').isExisting());

    await browser.$('.search-box input[type="text"]').setValue('This term appears in the granted licence');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('a=Content search - granted').isExisting());
  });

  it('can filter ra and continuation projects', async () => {
    await browser.$('summary=Continuation and RA').click();
    await browser.$('label=Projects requiring RAs').click();
    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('.search-box input[type="text"]').setValue('Content search - ra');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('a=Content search - ra').isExisting());
  });

  it('can filter ra and continuation projects', async () => {
    await browser.$('summary=Continuation and RA').click();
    await browser.$('label=Project continuations').click();
    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('.search-box input[type="text"]').setValue('Content search - continuation');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('a=Content search - continuation').isExisting());
  });

  it('displays the active search term and filters in the search summary', async () => {
    await browser.$('.search-box input[type="text"]').setValue('biological');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('summary=Document type').click();
    await browser.$('label=Licences').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('label=Applications').click();
    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('summary=Project status').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('label=Expired projects').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.strictEqual(await browser.$('.content-search-summary span.search-term').getText(), 'biological');

    const activeFilters = await browser.$$('.content-search-summary span.active-filter').map(el => el.getText());
    assert.ok(activeFilters.includes('Licences'));
    assert.ok(activeFilters.includes('Applications'));
    assert.ok(activeFilters.includes('Expired projects'));
  });

  it('can clear just the search term', async () => {
    await browser.$('.search-box input[type="text"]').setValue('biological');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('summary=Document type').click();
    await browser.$('label=Licences').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('label=Applications').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.strictEqual(await browser.$('.content-search-summary span.search-term').getText(), 'biological');

    await browser.$('a=Clear search').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(!await browser.$('.content-search-summary span.search-term').isDisplayed(), 'there should be no active search term');

    const activeFilters = await browser.$$('.content-search-summary span.active-filter').map(el => el.getText());
    assert.ok(activeFilters.includes('Licences'), 'the filters should still be active');
    assert.ok(activeFilters.includes('Applications'), 'the filters should still be active');
  });

  it('can clear all the search params', async () => {
    await browser.$('.search-box input[type="text"]').setValue('biological');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    await browser.$('summary=Document type').click();
    await browser.$('label=Licences').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('label=Applications').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.strictEqual(await browser.$('.content-search-summary span.search-term').getText(), 'biological');

    await browser.$('a=Clear all').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.strictEqual(await browser.$('.search-box input[type="text"]').getValue(), '', 'the search input should be blank');
    assert.ok(!await browser.$('.content-search-summary span.search-term').isDisplayed(), 'there should be no active search term');
    assert.strictEqual(await browser.$$('.content-search-summary span.active-filter').length, 0, 'there should be no active search filters');
  });

});
