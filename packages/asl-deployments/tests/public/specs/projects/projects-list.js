import assert from 'assert';
import { gotoProjectList } from '../../helpers/project.js';

const BASIC_USER_PROJECT_LICENCE_NUMBER = 'PR-123456';

describe('Projects directory', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  it('will filter by project title', async() => {
    await gotoProjectList(browser);

    await browser.$('.search-box input[type="text"]').setValue('anti-cancer');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const projects = await Promise.all(await browser
      .$$('tbody tr td.title')
      .map(td => td.getText()));

    projects.forEach(project =>
      assert.ok(project.toLowerCase().includes('anti-cancer'))
    );
  });

  it('can filter by project title on projects with colons in the title (regression)', async() => {
    await gotoProjectList(browser);

    assert.ok(!await browser.$('td=ASRU amendment in progress: draft').isDisplayed());

    await browser.$('.search-box input[type="text"]').setValue('ASRU amendment in progress: draft');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(await browser.$('td=ASRU amendment in progress: draft').isDisplayed());
  });

  it('will filter by licence holder', async() => {
    await gotoProjectList(browser);

    await browser.$('.search-box input[type="text"]').setValue('brian');
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const holders = await Promise.all(await browser
      .$$('tbody tr td.licenceHolder')
      .map(td => td.getText()));

    holders.forEach(holder => assert.ok(holder.toLowerCase().includes('brian')));
  });

  it('will filter by licence number', async() => {
    await gotoProjectList(browser);

    await browser.$('.search-box input[type="text"]').setValue(BASIC_USER_PROJECT_LICENCE_NUMBER);
    await browser.$('.search-box button').click();

    await browser.$('table:not(.loading)').waitForExist();

    const licenceNumber = await browser.$('tbody tr td.licenceNumber').getText();

    assert.equal(licenceNumber, BASIC_USER_PROJECT_LICENCE_NUMBER);
  });

  it('will link to the profile page if a name link is clicked', async() => {
    await gotoProjectList(browser);

    const licenceHolderLink = await browser.$('td.licenceHolder a');
    const name = await licenceHolderLink.getText();

    await licenceHolderLink.click();
    assert.equal(await browser.$('h1').getText(), name);
  });

  it('can download a CSV containing all the projects at the establishment which are visible to the user', async() => {
    await gotoProjectList(browser);
    const csv = await browser.downloadFile('csv');

    assert.ok(csv.some(project => project['Licence status'] === 'inactive'), 'some of the projects should be inactive');
    assert.ok(csv.some(project => project['Licence status'] === 'active'), 'some of the projects should be active');
    assert.ok(csv.some(project => project['Licence status'] === 'expired'), 'some of the projects should be expired');
    assert.ok(csv.some(project => project['Licence status'] === 'revoked'), 'some of the projects should be revoked');
  });
});
