import assert from 'assert';
import { viewCase, editEnforcementFlag } from '../../../helpers/navigate.js';

describe('Close enforcement case', () => {

  before(async () => {
    await browser.withUser('inspector');
  });

  it('can close an enforcement case with remedial action', async () => {

    await browser.$('a=Enforcement cases').click();
    await viewCase(10070);
    await browser.$('a=Juliann Holson').click();

    assert.ok(await browser.$('.govuk-warning-text.enforcement.open').isDisplayed());

    await browser.$('a=Enforcement cases').click();
    await viewCase(10070);

    await browser.$('a=Edit enforcement flag').click();

    await browser.$('input[name="flagStatus"][value="closed"]').click();
    await browser.$('input[name="remedialAction"][value="inspector-advice"]').click();
    await browser.$('button=Save').click();

    await browser.$('.govuk-warning-text.enforcement.closed').waitForDisplayed();

    await browser.$('a=Juliann Holson').click();
    assert.ok(!await browser.$('.govuk-warning-text.enforcement.open').isDisplayed());
    assert.ok(await browser.$('.govuk-warning-text.enforcement.closed').isDisplayed());

    await browser.$('summary=Case details').click();
    assert.ok(await browser.$('p=Remedial action applied: Inspector advice').isDisplayed());
  });

  it('can close an enforcement case without a breach', async () => {
    await browser.$('a=Enforcement cases').click();
    await viewCase(10060);
    await browser.$('a=Honey Raggatt').click();

    assert.ok(await browser.$('.govuk-warning-text.enforcement.open').isDisplayed());

    await browser.$('a=Enforcement cases').click();
    await viewCase(10060);

    await editEnforcementFlag('Honey Raggatt');

    await browser.$('input[name="flagStatus"][value="no-breach"]').click();
    await browser.$('button=Save').click();
    await browser.waitUntil(async () => !await browser.$('button=Save').isDisplayed());

    // go to profile
    await browser.url('/');
    await browser.$('a=People').click();
    await browser.$('input[name="filter-*"]').setValue('Honey Raggatt');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();
    await browser.$('a=Honey Raggatt').click();
    // no flag is displayed on profile
    assert.ok(!await browser.$('.govuk-warning-text.enforcement').isDisplayed());

    await browser.$('a=Enforcement cases').click();
    await viewCase(10060);
    await browser.$('a=Laurie Stuckford').click();
    // flag is still displayed on other subjects
    assert.ok(await browser.$('.govuk-warning-text.enforcement.open').isDisplayed());
    assert.ok(await browser.$('p=This person is subject to ongoing enforcement activity under case 10060').isDisplayed());
  });

});
