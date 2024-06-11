import assert from 'assert';
import { gotoProfile } from '../../helpers/profile.js';
import { usersWereNotified } from '../../../helpers/common.js';
import userRoles from '../../helpers/roles.js';

const PIL_NO = 'YW-052506';

const CROYDON_NTCOS = userRoles[8201].admins;
const CROYDON_ADMINS = userRoles[8201].ntcos;

const UNI_OF_LIFE_ADMINS = userRoles[10001].admins;
const UNI_OF_LIFE_NTCOS = userRoles[10001].ntcos;

describe('PIL transfer', () => {

  after(async () => {
    await browser.withUser('piltransfer');
    await browser.$('a=In progress').click();
    await browser.$('a=PIL transfer').click();
    await browser.$('label=Discard transfer').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Discard transfer').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');
  });

  it('does not allow admins other than the PIL holder to transfer', async () => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Cele Siviter');
    await browser.$(`a=${PIL_NO}`).click();
    await browser.$('a=Amend licence').click();
    assert.ok(!await browser.$('li.establishment').$('a=Edit').isExisting(), 'Establishment edit link should not be shown to non-PIL-holder');
  });

  it('can initiate a PIL transfer', async () => {
    await browser.withUser('piltransfer');
    await browser.$('h3=University of Croydon').click();
    await browser.$('.expanding-panel.open').$(`a=${PIL_NO}`).click();
    await browser.$('a=Amend or transfer licence').click();

    await browser.$('.section-item.establishment').$('a=Edit').click();

    await browser.$('label=University of Life').click();
    await browser.$('button=Continue').click();

    assert(await browser.$('.procedures-diff').$('th=Current categories').isDisplayed(), 'the current procedures are displayed');
    assert(await browser.$('.species-diff').$('th=Current animal types').isDisplayed(), 'the currrent species are displayed');

    const transferTime = new Date();

    await browser.$('input[name="declaration"]').click();
    await browser.$('button=Continue').click();
    await browser.$('textarea').setValue('Transferring PIL');
    await browser.$('button=Submit to NTCO').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await browser.url('/');
    await browser.$('a=In progress').click();
    await browser.$('a=PIL transfer').click();

    const transferTo = await browser.$('#establishment table.compare').$('span.highlight').getText();
    assert.equal(transferTo, 'University of Life');

    assert(await browser.$('.procedures-diff').$('th=Current categories').isDisplayed(), 'the current procedures are displayed');
    assert(await browser.$('.species-diff').$('th=Current animal types').isDisplayed(), 'the current species are displayed');

    const APPLICANT = 'csiviter0@example.com';
    assert(usersWereNotified(browser, [APPLICANT], 'task-change', transferTime), 'applicant should be sent task status change notification');
    assert(usersWereNotified(browser, CROYDON_NTCOS, 'task-change', transferTime), 'outgoing NTCOs should be sent task status change notification');
    assert(usersWereNotified(browser, CROYDON_ADMINS, 'task-change', transferTime), 'outgoing admins should be sent task status change notification');

    assert(usersWereNotified(browser, UNI_OF_LIFE_NTCOS, 'task-action', transferTime), 'receiving NTCOs should be sent action required notification');
    assert(usersWereNotified(browser, UNI_OF_LIFE_ADMINS, 'task-change', transferTime), 'receiving admins should be sent task status change notification');
  });

  it('can recall and edit and resubmit a PIL transfer', async () => {

    await browser.withUser('piltransfer');

    await browser.$('a=In progress').click();
    assert(await browser.$('a=PIL transfer').isDisplayed(), 'Task should be in In Progress tasks list');
    await browser.$('a=PIL transfer').click();

    await browser.$('label=Recall transfer').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Recall transfer').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');

    await browser.url('/');
    assert(await browser.$('a=PIL transfer').isDisplayed(), 'Task should be in Outstanding tasks list');
    await browser.$('a=PIL transfer').click();

    await browser.$('label*=Edit and resubmit').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Animal types').click();

    // add gerbils to PIL
    await browser.$('label=Gerbils').click();
    await browser.$('button=Continue').click();
    assert.equal(await browser.$$('.species-diff ul.proposed li .diff').length, 1, 'there should be one species added (Gerbils)');

    await browser.$('input[name="declaration"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button*=Edit and resubmit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await browser.url('/');
    await browser.$('a=In progress').click();

    assert(await browser.$('a=PIL transfer').isDisplayed(), 'Task should be in In Progress tasks list');
    await browser.$('a=PIL transfer').click();

    assert.ok(await browser.$('#species').$('li=Gerbils').isDisplayed(), 'Gerbils should be listed on task review screen');

  });
});
