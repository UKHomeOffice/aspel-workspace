import assert from 'assert';

describe('task search', () => {

  before(async () => {
    await browser.withUser('inspector');
  });

  beforeEach(async () => {
    await browser.url('/');
    await browser.$('a=Search all tasks').click();
  });

  it('can search for specific tasks by applicant name', async () => {

    await browser.$('.search-box input[type="text"]').setValue('maire');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('.govuk-react-datatable').$('p=Maire Hanson').$('strong=Maire').isDisplayed());
  });

});
