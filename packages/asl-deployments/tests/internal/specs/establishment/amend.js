import assert from 'assert';
import { gotoEstablishmentDetails, gotoEstablishmentSearch,
  performSearch } from '../../helpers/establishment.js';

async function assertBeforeAndAfter(field, before, after) {
  const tableRow = await browser.$('td=' + field).$('..');
  const tableCells = await tableRow.$$('td');
  assert.equal(await tableCells[1].getText(), before);
  assert.equal(await tableCells[2].getText(), after);
}

describe('Establishment amendment', async () => {

  const AUTO_COMPLETE_DELAY = 500;

  before(async () => {
    await browser.withUser('inspector');
  });

  beforeEach(async () => {
    await gotoEstablishmentDetails(browser, 'Marvell Pharmaceutical');
  });

  it('Individual PEL requires PELH', async () => {
    await browser.$('a=Amend licence').click();
    await browser.$('input[name="corporateStatus"][value="non-profit"]').click();
    await browser.$('button=Continue').click();

    const errorMessages = await browser.$$('.govuk-error-message').map(error => error.getText());
    assert.ok(errorMessages.includes('Please select an Establishment Licence Holder (PELH)'), 'error is shown if no pelh selected');
  });

  it('allows inspector to change establishment details to individual PEL', async () => {
    await browser.$('a=Amend licence').click();

    await browser.$('input[name="corporateStatus"][value="non-profit"]').click();

    // need a short pause to let autocomplete initialise
    await browser.pause(AUTO_COMPLETE_DELAY);
    await browser.$('#pelh').autocomplete('Neil Down');

    await browser.$('textarea[name="comments"]').setValue('Updating to individual PEL with PELH');

    await browser.$('button=Continue').click();

    // Check differences
    await assertBeforeAndAfter('What type of establishment licence is this?', '-', 'Individual PEL');
    await assertBeforeAndAfter('Named Person Responsible for Compliance (NPRC)', 'Bruce Banner', 'N/A');
    await assertBeforeAndAfter('Establishment Licence Holder (PELH)', 'N/A', 'Neil Down');

    await browser.$('button=Submit').click();
    await browser.waitForSuccess();

    assert.ok(browser.$('h1=Approved').isDisplayed());

    // Check differences in Completed task
    await browser.$('a=View history of application').click();
    assert.ok(browser.$('h1=Establishment amendment').isDisplayed());

    await assertBeforeAndAfter('What type of establishment licence is this?', '-', 'Individual PEL');
    await assertBeforeAndAfter('Named Person Responsible for Compliance (NPRC)', 'Bruce Banner', 'N/A');
    await assertBeforeAndAfter('Establishment Licence Holder (PELH)', 'N/A', 'Neil Down');
  });

  it('Corporate requires all Individual legally accountable for the corporate entity fields and nprc', async () => {
    await browser.$('a=Amend licence').click();

    await browser.$('input[name="corporateStatus"][value="corporate"]').click();

    await browser.$('button=Continue').click();

    const errorMessages = await browser.$$('.govuk-error-message').map(error => error.getText());
    assert.ok(errorMessages.includes('Individual legally accountable for the corporate entity name cannot be empty.'), 'error is shown if no legal name');
    assert.ok(errorMessages.includes('Individual legally accountable for the corporate entity phone cannot be empty.'), 'error is shown if no legal name');
    assert.ok(errorMessages.includes('Individual legally accountable for the corporate entity email cannot be empty.'), 'error is shown if no legal name');
    assert.ok(errorMessages.includes('Please select a Named Person Responsible for Compliance (NPRC)'), 'error is shown if no nprc selected');
  });

  it('allows inspector to change establishment details to corporate', async () => {
    await browser.$('a=Amend licence').click();

    await browser.$('input[name="corporateStatus"][value="corporate"]').click();
    await browser.$('input[name=legalName]').setValue('John Smith');
    await browser.$('input[name=legalEmail]').setValue('John.Smith@example.com');
    await browser.$('input[name=legalPhone]').setValue('01234 123456');

    // need a short pause to let autocomplete initialise
    await browser.pause(AUTO_COMPLETE_DELAY);
    await browser.$('#nprc').autocomplete('Bruce Banner');

    await browser.$('textarea[name="comments"]').setValue('Updating to corporate with NPRC');

    await browser.$('button=Continue').click();

    // Check differences
    await assertBeforeAndAfter('What type of establishment licence is this?', 'Individual PEL', 'Corporate PEL');
    await assertBeforeAndAfter('Named Person Responsible for Compliance (NPRC)', 'N/A', 'Bruce Banner');
    await assertBeforeAndAfter('Establishment Licence Holder (PELH)', 'Neil Down', 'N/A');
    await assertBeforeAndAfter('Individual legally accountable for the corporate entity', 'N/A', 'John Smith\nJohn.Smith@example.com\n01234 123456');

    await browser.$('button=Submit').click();
    await browser.waitForSuccess();

    assert.ok(browser.$('h1=Approved').isDisplayed());

    // Check differences in Completed task
    await browser.$('a=View history of application').click();
    assert.ok(browser.$('h1=Establishment amendment').isDisplayed());

    await assertBeforeAndAfter('What type of establishment licence is this?', 'Individual PEL', 'Corporate PEL');
    await assertBeforeAndAfter('Named Person Responsible for Compliance (NPRC)', 'N/A', 'Bruce Banner');
    await assertBeforeAndAfter('Establishment Licence Holder (PELH)', 'Neil Down', 'N/A');
    await assertBeforeAndAfter('Individual legally accountable for the corporate entity', 'N/A', 'John Smith\nJohn.Smith@example.com\n01234 123456');
  });

  it('the establishment is marked as corporate in the appropriate places and Individual legally accountable for the corporate entity details are displayed', async () => {
    await gotoEstablishmentSearch(browser);
    await performSearch(browser, 'Marvell Pharmaceutical');
    assert.ok(await browser.$('//a[string() = "Marvell Pharmaceutical"]/ancestor::td//span[@class="govuk-tag" and text()="corporate"]').isDisplayed());

    await browser.$('a*=Marvell Pharmaceutical').click();
    assert.ok(browser.$('dt=Establishment licence type').isDisplayed());
    assert.ok(browser.$('dd=Corporate PEL').isDisplayed());

    await browser.$('a*=Establishment details').click();
    await browser.$('h3=Individual legally accountable for the corporate entity').click();

    assert.ok(browser.$('dd=John Smith').isDisplayed());
    assert.ok(browser.$('dd=John.Smith@example.com').isDisplayed());
    assert.ok(browser.$('dd=01234 123456').isDisplayed());

    await browser.$('a=View approved areas').click();

    await browser.$('h2').$('.govuk-tag=corporate').isDisplayed();
  });

  it('allows inspector to amend establishment details', async () => {
    await browser.$('a=Amend licence').click();

    await browser.$('input[name="authorisationTypes"][value="killing"]').click();
    await browser.$('textarea[name*="authorisation-killing-method"]').setValue('Method');
    await browser.$('textarea[name*="authorisation-killing-description"]').setValue('Description');
    await browser.$('textarea[name="comments"]').setValue('Reason for the thing');

    await browser.$('button=Continue').click();

    await browser.$('button=Submit').click();
    await browser.waitForSuccess();

    assert.ok(browser.$('h1=Approved').isDisplayed());
  });

});
