import assert from 'assert';

describe('ROPS summary report', () => {

  describe('ASRU users without rops role', () => {
    before(async () => {
      await browser.withUser('inspector');
    });

    it('do not see the returns of procedures footer link', async () => {
      await browser.url('/');
      assert.ok(!await browser.$('.footer-menu').$('a=Returns of procedures').isDisplayed(), 'there should not be a footer link to rops report');
    });

    it('cannot view the rops summary report', async () => {
      await browser.url('/rops');
      assert.ok(await browser.$('h1=You do not have permission to access this page').isDisplayed(), 'the rops report page should not be accessible');
    });
  });

  describe('ASRU users with rops role', () => {
    before(async () => {
      await browser.withUser('asruropper');
    });

    it('can view the rops summary report', async () => {
      assert.ok(await browser.$('.footer-menu').$('a=Returns of procedures').isDisplayed(), 'there should be a footer link to rops report');
      await browser.$('.footer-menu').$('a=Returns of procedures').click();
      assert.ok(await browser.$('h1=Returns of procedures').isDisplayed(), 'the rops report page should be accessible');
    });

    it('should have 4 returns submitted for 2020', async () => {
      await browser.url('/rops/2020');

      const due = parseInt(await browser.$('.rops-due').getText(), 10);
      const submitted = parseInt(await browser.$('.rops-submitted').getText(), 10);
      const outstanding = parseInt(await browser.$('.rops-outstanding').getText(), 10);

      assert.deepStrictEqual(submitted, 4, 'should display 4 submitted returns for 2020');
      assert.deepStrictEqual(due - submitted, outstanding, 'returns outstanding should equal returns due minus returns submitted');
    });

    it('can view a table with a summary per establishment', async () => {
      await browser.url('/');
      await browser.$('.footer-menu').$('a=Returns of procedures').click();
      await browser.$('nav.govuk-tabs').$('a=Establishments').click();

      assert.ok(await browser.$('.govuk-table tr td').$('a=Big Pharma').isDisplayed(), 'there should be a table of establishments');
    });

    it('can filter the establishment summary table by name', async () => {
      await browser.url('/');
      await browser.$('.footer-menu').$('a=Returns of procedures').click();
      await browser.$('nav.govuk-tabs').$('a=Establishments').click();

      await browser.$('input[name="filter"]').setValue('Croydon');
      await browser.$('button[type=submit]').click();
      await browser.$('table:not(.loading)').waitForExist();

      const results = await browser.$$('.govuk-table tbody tr');

      for (const row of results) {
        const estName = await row.$('td.name').getText();
        assert.ok(estName.includes('Croydon'), 'every result should contain the text Croydon');
      }
    });

  });

});
