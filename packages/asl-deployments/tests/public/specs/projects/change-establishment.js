import assert from 'assert';
import { gotoProjectManagementPage, discardAmendment, completeAwerb, discardTask } from '../../helpers/project.js';

describe('Change primary establishment', () => {
  afterEach(async() => {
    await browser.waitForSync();
    await discardAmendment(browser, 'Transfer basic user project');
  });

  it('cannot be changed by an admin who is not the licence holder', async() => {
    await browser.withUser('holc');
    await gotoProjectManagementPage(browser, 'Transfer basic user project');
    await browser.$('button=Amend licence').click();
    await browser.$('a=Establishments').click();

    assert.ok(!await browser.$('label=Marvell Pharmaceutical').isExisting());
  });

  // regression for "Another establishment" showing on unchanged establishment.
  it('shows the establishment name to non-licence holder', async() => {
    await browser.withUser('holc');
    await gotoProjectManagementPage(browser, 'Transfer basic user project');
    await browser.$('button=Amend licence').click();
    await browser.$('a=Establishments').click();
    assert.ok(await browser.$('.establishment-selector').$('p=University of Croydon').isExisting());
  });

  it('can be changed by the licence holder', async() => {
    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, 'Transfer basic user project');
    assert.ok(await browser.$('li=Transfer to another establishment').isExisting());
    await browser.$('button=Amend licence').click();
    await browser.$('a=Establishments').click();

    assert.ok(await browser.$('label=Marvell Pharmaceutical').isExisting());
  });

  it('includes Croydon in the selectable protocol locations before the primary establishment is changed', async() => {
    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, 'Transfer basic user project');
    await browser.$('button=Amend licence').click();

    await browser.$('a=Protocols').click();
    await browser.$('h2*=P1').click();

    assert.ok(await browser.$('.location-selector').$('label=University of Croydon').isDisplayed());
  });

  it('it does not include Croydon in the selectable protocol locations once the primary establishment is changed', async() => {
    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, 'Transfer basic user project');
    await browser.$('button=Amend licence').click();

    await browser.$('a=Establishments').click();
    await browser.$('label=Marvell Pharmaceutical').click();
    await browser.$('a=List of sections').click();

    await browser.$('a=Protocols').click();
    await browser.$('h2*=P1').click();

    assert.ok(!await browser.$('.location-selector').$('label=University of Croydon').isDisplayed());
    assert.strictEqual(await browser.$('.location-selector').$$('label=Marvell Pharmaceutical').length, 1, 'Marvell Pharma should only appear once');
  });

  it('marks experience and protocols as incomplete if establishment changed', async() => {
    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, 'Transfer basic user project');
    await browser.$('button=Amend licence').click();
    await browser.$('a=Establishments').click();

    await browser.$('label=Marvell Pharmaceutical').click();
    await browser.$('a=List of sections').click();

    assert.ok(await browser.$('a=Experience').$('../..').$('span=incomplete').isExisting());
    assert.ok(await browser.$('a=Protocols').$('../..').$('span=incomplete').isExisting());
  });

  it('can submit PPL transfer with aa changes and additional establishments are correct (ASL-4043)', async() => {
    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, 'Transfer basic user project');
    await browser.$('button=Amend licence').click();
    await browser.$('a=Establishments').click();

    await browser.$('label=Marvell Pharmaceutical').click();
    await browser.$('button=Continue').click();

    await browser.$('h2=Additional establishment 1').parentElement().$('a=Remove').click();

    await browser.$('button=Add another additional establishment').click();
    await browser.$('h2=Additional establishment 2').parentElement().$('label=University of Croydon').click();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue').click();

    await browser.$('a=Experience').click();
    await browser.$('button=Continue').click();
    await browser.$('label=This section is complete').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Protocols').click();
    await browser.$('.control-panel button').click();
    await browser.$('label=This section is complete').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Transfer and movement of animals').click();
    await browser.$('button=Continue').click();
    await browser.$('label=This section is complete').click();
    await browser.$('button=Continue').click();

    await browser.waitForSync();

    await browser.$('button=Continue').click();

    await browser.$('textarea[name=comments]').setValue('Reason for the change');

    await browser.$('button*=Submit PPL amendment').click();
    await browser.waitForSuccess();

    await browser.withUser('holc');
    await browser.$(`[title="Transfer basic user project"]`).$('a=PPL transfer').click();

    let aa = await browser.$$('#submitted-version li').map(aa => aa.getText());
    assert.deepStrictEqual(aa,
      ['University of Croydon', 'University of Life']);

    await browser.withUser('basic');
    await discardTask(browser, 'Transfer basic user project');
  });

  it('can submit PPL transfer, it can be endorsed by admins at both establishments, recalled and resubmitted', async() => {
    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, 'Transfer basic user project');
    await browser.$('button=Amend licence').click();
    await browser.$('a=Establishments').click();

    await browser.$('label=Marvell Pharmaceutical').click();
    await browser.$('a=List of sections').click();

    await browser.$('a=Experience').click();
    await browser.$('button=Continue').click();
    await browser.$('label=This section is complete').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Protocols').click();
    await browser.$('.control-panel button').click();
    await browser.$('label=This section is complete').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Transfer and movement of animals').click();
    await browser.$('button=Continue').click();
    await browser.$('label=This section is complete').click();
    await browser.$('button=Continue').click();

    await browser.waitForSync();

    await browser.$('button=Continue').click();

    await browser.$('textarea[name=comments]').setValue('Reason for the change');

    await browser.$('button*=Submit PPL amendment').click();
    await browser.waitForSuccess();

    await browser.withUser('holc');
    await browser.$(`[title="Transfer basic user project"]`).$('a=PPL transfer').click();
    await browser.$('h1=Project licence transfer').waitForExist();
    await browser.$('label=Endorse transfer request').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="awerb-exempt"][value="false"]').click();
    assert.ok(await browser.$('h2*=AWERB review at University of Croydon').isDisplayed(), 'holc should be prompted to enter Croydons AWERB');
    await completeAwerb(browser);
    assert.ok(await browser.$('p=By endorsing this transfer request on behalf of University of Croydon, I agree that:').isDisplayed());

    await browser.$('button=Endorse transfer request').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Endorsed');

    await browser.withUser('pharmaadmin');
    await browser.$(`[title="Transfer basic user project"]`).$('a=PPL transfer').click();

    assert.ok(await browser.$('.activity-log').$('p=By endorsing this transfer request on behalf of University of Croydon, I agree that:').isDisplayed());

    await browser.$('label=Endorse transfer request').click();
    await browser.$('button=Continue').click();
    assert.ok(await browser.$('h2*=AWERB review at Marvell Pharmaceutical').isDisplayed(), 'pharmaadmin should be prompted to enter Marvells AWERB');
    await completeAwerb(browser);
    assert.ok(await browser.$('p=By endorsing this transfer request on behalf of Marvell Pharmaceutical, I agree that:').isDisplayed());

    await browser.$('button=Endorse transfer request').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Endorsed');

    await browser.withUser('basic');

    await gotoProjectManagementPage(browser, 'Transfer basic user project');

    await browser.$('a=View task').click();

    assert.ok(await browser.$('.activity-log').$('p=By endorsing this transfer request on behalf of Marvell Pharmaceutical, I agree that:').isDisplayed());
    assert.ok(await browser.$('.activity-log').$('dt=Marvell Pharmaceutical AWERB review date:'), 'receiving establishment AWERB review date should be displayed');
    await browser.$('summary=Show previous activity');
    assert.ok(await browser.$('.older-activity').$('dt=AWERB review date:'), 'outgoing establishment AWERB review date should be displayed');
    assert.ok(!await browser.$('dd=Invalid Date').isDisplayed(), 'there should be no invalid AWERB dates');

    await browser.$('label=Recall transfer').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Recall transfer').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');

    await gotoProjectManagementPage(browser, 'Transfer basic user project');

    await browser.$('a=View task').click();
    await browser.$('label=Edit and resubmit the transfer request').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue').click();

    await browser.$('textarea[name=comments]').setValue('Reason for the change');

    await browser.$('button=Submit PPL transfer request').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project licence transfer');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await gotoProjectManagementPage(browser, 'Transfer basic user project');

    await browser.$('a=View task').click();
    await browser.$('h1=Project licence transfer').waitForEnabled();

    assert.ok(await browser.$('.task-status').$('span=Awaiting endorsement').isDisplayed());
  });
});
