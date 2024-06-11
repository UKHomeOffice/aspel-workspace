import assert from 'assert';

describe('PIL Review Banners', () => {

  it('shows due banner to users with PIL reviews due', async () => {
    await browser.withUser('due-pil-review@example.com');
    const banner = await browser.$('.govuk-warning-text.info');
    const text = await banner.getText();
    assert.ok(text.includes('Personal licence YC-123457 is due a review by'));
  });

  it('shows overdue banner to users with PIL reviews overdue', async () => {
    await browser.withUser('overdue-pil-review@example.com');
    const banner = await browser.$('.govuk-warning-text.info');
    const text = await banner.getText();
    assert.ok(text.includes('Personal licence YC-123456 is overdue a review confirming it\'s still in use and up to date'));
  });

});
