import assert from 'assert';
import { gotoProfilePage } from '../../../internal/helpers/profile.js';
import { findTask } from '../../../helpers/task.js';

const PIL_NO = 'YW-052506';

describe('ASRU transferring a PIL', () => {
  it('can initiate a PIL transfer', async () => {
    await browser.withUser('licensing');
    await gotoProfilePage(await browser, 'Cele Siviter');
    await browser.$('h3=University of Croydon').click();
    await browser.$('.expanding-panel.open').$(`a=${PIL_NO}`).click();
    await browser.$('a=Amend licence').click();

    await browser.$('.section-item.establishment').$('a=Edit').click();
    await browser.$('label=University of Life').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Training').click();
    await browser.$('label[for*="update-false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue').click();
    await browser.$('textarea').setValue('Transferring PIL as licensing');
    await browser.$('button=Submit to NTCO').click();

    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await browser.url('/');
    await browser.$('a=In progress').click();
    const _task = await findTask(browser, 'a=PIL transfer');
    await _task.click();
    const transferTo = await browser.$('span.highlight').getText();
    assert.equal(transferTo, 'University of Life');
  });

  it('NTCO can endorse a PIL transfer initiated by ASRU', async () => {
    await browser.withUser('ntco');
    assert.equal(await browser.$('h1').getText(), 'Hello Neil');
    await browser.$('.tasklist').$('td*=Cele Siviter').$('a=PIL transfer').click();

    await browser.$('label[for*=status-endorsed]').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('.task-declaration').isDisplayed());

    await browser.$('button=Endorse transfer request').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Endorsed');
  });

  after(async () => {
    await browser.withUser('licensing');
    await browser.gotoOutstandingTasks();
    await browser.$('.tasklist').$('td*=Cele Siviter').$('a=PIL transfer').click();
    await browser.$('label=Refuse transfer request').click();
    await browser.$('button=Continue').click();
    await browser.$('textarea').setValue('Nope');
    await browser.$('button=Refuse transfer request').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Refused');
  });
});
