import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';

describe('Retrospective Assessment Banners', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  it('should not display on an active project with an RA condition', async() => {
    await gotoProjectLandingPage(browser, 'RA true', 'Active');
    assert.ok(!await browser.$('.govuk-warning-text.info').isDisplayed(), 'No banner should be displayed');
  });

  it('should not display on an expired project with no RA condition', async() => {
    await gotoProjectLandingPage(browser, 'Expired project', 'Inactive');
    assert.ok(!await browser.$('.govuk-warning-text.info').isDisplayed(), 'No banner should be displayed');
  });

  it('should display on an expired project with an RA condition', async() => {
    await gotoProjectLandingPage(browser, 'RA due revoked legacy', 'Inactive');
    assert.ok(await browser.$('.govuk-warning-text.info').isDisplayed(), 'A banner should be displayed');
    assert.ok(
      await browser
        .$('.govuk-warning-text.info')
        .$('p*=A retrospective assessment of this project\'s outcomes is due')
        .isDisplayed()
    );
    assert.ok(await browser.$('.govuk-warning-text.info').$('button=Start assessment').isDisplayed());
  });

  it('updates call to action once RA is started', async() => {
    await gotoProjectLandingPage(browser, 'RA due revoked legacy', 'Inactive');
    assert.ok(await browser.$('.govuk-warning-text.info').$('button=Start assessment').isDisplayed());

    await browser.$('.govuk-warning-text.info').$('button=Start assessment').click();

    // return to landing page
    await browser.$('a=Go to project overview').click();

    assert.ok(!await browser.$('.govuk-warning-text.info').$('button=Start assessment').isDisplayed());
    assert.ok(await browser.$('.govuk-warning-text.info').$('a=View draft assessment').isDisplayed());
  });

});
