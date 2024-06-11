import assert from 'assert';
import {
  gotoProjectLandingPage
} from '../../helpers/project.js';

describe('Submit project', () => {

  it('can submit a new application', async() => {
    await browser.withUser('basic');
    await browser.url('/');
    await gotoProjectLandingPage(browser, 'Submit application test', 'Drafts');
    await browser.$('a=Open application').click();

    // continue to submit amendment
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('h1').getText(), 'Send application');
    assert.equal(await browser.$('h2').getText(), 'Submit application test');

    assert.ok(!await browser.$('h2=Declaration').isDisplayed());
    assert.ok(!await browser.$('p=By submitting this application on behalf of Basic User, I agree that:').isDisplayed());

    await browser.$('button=Submit PPL application').click();

    await browser.waitForSuccess();
    await browser.$('a=track the progress of this request.').click();

    assert.equal(await browser.$('.task-status .badge').getText(), 'AWAITING ENDORSEMENT');

    await browser.withUser('holc');

    await browser.$('[title="Submit application test"]').$('a=PPL application').click();

    await browser.$('input[name="status"][value="endorsed"]').click();
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('h2=Declaration').isDisplayed());
    assert.ok(await browser.$('p=By endorsing this application on behalf of University of Croydon, I agree that:').isDisplayed());
    assert.ok(!await browser.$('p=By submitting this application on behalf of Basic User, I agree that:').isDisplayed());

    await browser.$('input[name="awerb-8201-day"]').setValue('01');
    await browser.$('input[name="awerb-8201-month"]').setValue('01');
    await browser.$('input[name="awerb-8201-year"]').setValue('2022');
    await browser.$('button=Endorse application').click();
    await browser.waitForSuccess();
    await browser.$('a=track the progress of this request.').click();

    assert.equal(await browser.$('.task-status .badge').getText(), 'AWAITING DECISION');
  });

  it('admin can submit on behalf of a basic user', async() => {
    await browser.withUser('holc');
    await browser.url('/');
    await gotoProjectLandingPage(browser, 'Submit on behalf test', 'Drafts');
    await browser.$('a=Open application').click();

    // continue to submit amendment
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('h1').getText(), 'Send application');
    assert.equal(await browser.$('h2').getText(), 'Submit on behalf test');
    assert.ok(await browser.$('h2=Declaration').isDisplayed());
    assert.ok(await browser.$('p=By endorsing this application on behalf of University of Croydon, I agree that:').isDisplayed());
    assert.ok(await browser.$('p=By submitting this application on behalf of Basic User, I agree that:').isDisplayed());

    await browser.$('input[name="awerb-8201-day"]').setValue('01');
    await browser.$('input[name="awerb-8201-month"]').setValue('01');
    await browser.$('input[name="awerb-8201-year"]').setValue('2022');

    await browser.$('button=Submit PPL application to Home Office').click();

    await browser.waitForSuccess();
    await browser.$('a=track the progress of this request.').click();

    assert.equal(await browser.$('.task-status .badge').getText(), 'AWAITING DECISION');

  });

});
