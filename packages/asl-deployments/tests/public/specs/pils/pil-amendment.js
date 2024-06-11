import assert from 'assert';
import { gotoProfile } from '../../helpers/profile.js';

const checkProceduresDiff = async browser => {
  assert(await browser.$('.procedures-diff').isDisplayed(), 'a procedures diff is displayed');
  assert.equal(await browser.$$('.procedures-diff ul.current li').length, 4, 'there should be four procedures in the current side of diff');
  assert.equal(await browser.$$('.procedures-diff ul.current li.removed').length, 2, 'there should be two procedures removed from the current side');
  assert.equal(await browser.$$('.procedures-diff ul.proposed li').length, 3, 'there should be three procedures in the proposed side of diff');
  assert.equal(await browser.$$('.procedures-diff ul.proposed li.diff').length, 1, 'there should be one procedure added');
};

const checkSpeciesDiff = async browser => {
  assert(await browser.$('.species-diff').isDisplayed(), 'a species diff is displayed');
  assert.equal(await browser.$$('.species-diff ul.current li').length, 2, 'there should be two species on the current side of the diff');
  assert.equal(await browser.$$('.species-diff ul.current li .removed').length, 2, 'there should be two species removed (Mice, Rats)');
  assert.equal(await browser.$$('.species-diff ul.proposed li').length, 2, 'there should be two species on the proposed side of the diff');
  assert.equal(await browser.$$('.species-diff ul.proposed li .diff').length, 2, 'there should be two species added (Babu, Jabu)');
};

describe('PIL Amendment', () => {

  beforeEach(async () => {
    await browser.withUser('holc');
  });

  it('Cannot discard a PIL from an amendment', async () => {
    await gotoProfile(browser, 'Reagen Gimert');
    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=Amend licence').click();
    assert.ok(!await browser.$('button=Discard draft application').isExisting());
  });

  it('Can submit a PIL amendment', async () => {
    await gotoProfile(browser, 'Wood Bagger');
    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=Amend licence').click();

    await browser.$('a=Procedures').click();
    // Wood Bagger already has procedures B, C, D, F
    await browser.$('input[name="procedures"][value="A"]').click(); // add A
    await browser.$('input[name="procedures"][value="B"]').click(); // remove B
    await browser.$('input[name="procedures"][value="C"]').click(); // remove C
    await browser.$('button=Continue').click();
    await checkProceduresDiff(browser);

    await browser.$('a=Animal types').click();
    // Wood Bagger already has species Mice, Rats
    await browser.$('label=Mice').click();
    await browser.$('label=Rats').click();
    await browser.$('summary=Other').click();
    await browser.$('.multi-input-item input').setValue('Jabu');
    await browser.$('button=Add another').click();
    await browser.$('.multi-input-item:last-of-type input').setValue('Babu');
    await browser.$('button=Continue').click();
    await checkSpeciesDiff(browser);

    await browser.$('a=Training').click();
    await browser.$('label[for*="update-false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="declaration"]').click();
    await browser.$('button=Continue').click();
    await browser.$('textarea').setValue('Amending a PIL');
    await browser.$('button=Submit to NTCO').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
  });

  it('Displays the species and procedures diffs on the PIL amendment task', async () => {
    await gotoProfile(browser, 'Wood Bagger');
    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=View task').click();

    assert(await browser.$('h1=Personal licence amendment').isDisplayed(), 'it should take you to the task review page');
    await checkProceduresDiff(browser);
    await checkSpeciesDiff(browser);
  });

  it('Cannot amend or revoke a PIL with an amendment already in progress', async () => {
    await gotoProfile(browser, 'Wood Bagger');
    await browser.$('a[href*="/pil/"]').click();

    assert.ok(await browser.$('h2=Amendment in progress').isDisplayed());
    assert.ok(!await browser.$('a=Amend licence').isDisplayed());
    assert.ok(!await browser.$('a=Revoke licence').isDisplayed());
  });

  it('Can start a PIL amendment for a PIL with Cat D & F (regression)', async () => {
    await gotoProfile(browser, 'Reagen Gimert');

    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=Amend licence').click();

    assert.ok(await browser.$('h1*=Amend personal licence').isDisplayed());
  });

});
