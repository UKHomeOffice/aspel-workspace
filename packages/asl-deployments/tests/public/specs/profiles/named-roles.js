import assert from 'assert';
import { gotoProfile } from '../../helpers/profile.js';
import { findTask } from '../../../helpers/task.js';
import { gotoEstablishment } from '../../helpers/establishment.js';

const getAmendmentDetails = async() => {

  const amendmentDetails = await Promise.all(await browser
    .$$('//h2[span/text()="Amendment details"]/ancestor::div[@id="role"]//tbody/tr/td')
    .map(td => td.getText()));

  return amendmentDetails;
};

describe('Roles', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  describe('Add named role', () => {

    it('shows a validation error if no role is selected', async() => {
      await gotoProfile(browser, 'Dagny Aberkirder');
      await browser.$('a=Add role').click();
      await browser.$('button=Continue').click();

      assert(await browser.$('.govuk-error-message').isDisplayed());
      const errorMessage = await browser.$('.govuk-error-message').getText();
      assert.equal(errorMessage, 'Please select a role');
    });

    it('can add a new role', async() => {
      await gotoProfile(browser, 'Dagny Aberkirder');
      await browser.$('a=Add role').click();
      await browser.$('label*=NACWO').click();
      await browser.$('button=Continue').click();
      await browser.$('input[name="declaration"]').click();
      await browser.$('button=Submit').click();
      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Add named person');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
    });
  });

  describe('Remove named role', async() => {

    it('preselects role for removal if user only has one role', async() => {
      await browser.withUser('holc');
      await gotoProfile(browser, 'Megan Alberts');
      await browser.$('a=Remove role').click();
      await browser.$('button=Continue').click();

      assert(await browser.$('h2=You are removing:').isDisplayed());
      assert(await browser.$('p=Named animal care and welfare officer (NACWO)').isDisplayed());
    });

    it('shows a validation error if no role is selected', async() => {
      await gotoProfile(browser, 'Multiple Roles');
      await browser.$('a=Remove role').click();
      await browser.$('button=Continue').click();

      assert(await browser.$('.govuk-error-message').isDisplayed());
      const errorMessage = await browser.$('.govuk-error-message').getText();
      assert.equal(errorMessage, 'Please select a role');
    });

    // regression test for multiple role removal
    it('can remove multiple roles at the same time', async() => {
      await gotoProfile(browser, 'Multiple Roles');
      await browser.$('a=Remove role').click();
      await browser.$('input[value="nvs"]').click();
      await browser.$('button=Continue').click();

      await browser.$('label[for*="declaration-true"]').click();
      await browser.$('button=Submit').click();

      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Remove named person');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

      await gotoProfile(browser, 'Multiple Roles');
      await browser.$('a=Remove role').click();

      assert.ok(await browser.$('.open-role-tasks').$('li*=NVS').isDisplayed(), 'Existing role removal task should be shown');

      await browser.$('input[value="nio"]').click();
      await browser.$('button=Continue').click();

      await browser.$('label[for*="declaration-true"]').click();
      await browser.$('button=Submit').click();

      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Remove named person');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
    });

    // regression test for HOLC removal workflow
    it('can remove a HOLC', async() => {
      await gotoProfile(browser, 'Spare Holc (Croydon Only)');
      await browser.$('a=Remove role').click();
      // await browser.$('//input[@value="holc"]').click();
      await browser.$('button=Continue').click();

      await browser.$('label[for*="declaration-true"]').click();
      await browser.$('button=Submit').click();

      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Remove named person');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');

      await gotoProfile(browser, 'Spare Holc (Croydon Only)');

      assert.ok(!await browser.$('=Home Office liaison contact (HOLC)').isDisplayed(), 'HOLC role should have been removed from the profile');
    });

  });

  describe('Replace named role', () => {
    it('can add a new NPRC to corporate establishment', async() => {
      await browser.withUser('holc');
      await gotoProfile(browser, 'John Smith', 'Corporate Pharma');
      await browser.$('a=Add role').click();

      // Assert PELH isn't an option
      assert.ok(!await browser.$('.govuk-form-group').$('label*=Establishment licence holder (PELH)').isDisplayed());

      await browser.$('label*=NPRC').click();
      await browser.$('button=Continue').click();
      await browser.$('input[name="declaration"]').click();
      await browser.$('button=Submit').click();
      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Replace named person');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
    });

    it('appears on both users related tasks', async() => {
      await gotoProfile(browser, 'John Smith', 'Corporate Pharma');
      assert(await browser.$('.tasklist').$('td*=Replace named person (NPRC)').isDisplayed());

      await gotoProfile(browser, 'Dave Baker', 'Corporate Pharma');
      assert(await browser.$('.tasklist').$('td*=Replace named person (NPRC)').isDisplayed());
    });

    it('no longer shows PELH or NPRC as an option to Add Role', async() => {
      await gotoProfile(browser, 'John Smith', 'Corporate Pharma');
      await browser.$('a=Add role').click();

      // verify view task
      assert.ok(await browser.$('.open-role-tasks').$('li*=Named person responsible for compliance (NPRC)').isDisplayed());

      // verify no PELH or NPRC options available
      assert.ok(!await browser.$('.govuk-form-group').$('label*=Establishment licence holder (PELH)').isDisplayed());
      assert.ok(!await browser.$('.govuk-form-group').$('label*=Named person responsible for compliance (NPRC)').isDisplayed());
    });

    it('no longer shows PELH or NPRC as an option to Add Role on another profile', async() => {
      await gotoProfile(browser, 'Basic Small-Pharma', 'Corporate Pharma');
      await browser.$('a=Add role').click();

      // verify no PELH or NPRC options available
      assert.ok(!await browser.$('.govuk-form-group').$('label*=Establishment licence holder (PELH)').isDisplayed());
      assert.ok(!await browser.$('.govuk-form-group').$('label*=Named person responsible for compliance (NPRC)').isDisplayed());

      // verify task is for another profile
      await browser.$('.open-role-tasks').$('li*=Named person responsible for compliance (NPRC)').$('a=View task').click();
      assert.equal(await browser.$('.page-header h1').getText(), 'Replace named person');

      assert.deepStrictEqual(await getAmendmentDetails(),
        ['PELH or NRPC', 'Dave Baker', 'John Smith']);
    });

    it('replace NPRC removes any existing NPRC/PELH when approved', async() => {
      await browser.withUser('inspector');
      await browser.$('a=Outstanding').click();
      const task = await findTask(browser, `a=Replace named person (NPRC)`);
      await task.click();

      assert.equal(await browser.$('.page-header h1').getText(), 'Replace named person');

      assert.deepStrictEqual(await getAmendmentDetails(),
        ['PELH or NRPC', 'Dave Baker', 'John Smith']);

      await browser.$('label=Amend licence').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Amend licence').click();

      await browser.withUser('holc');
      await gotoEstablishment(browser, 'Corporate Pharma');
      await browser.$('a=People').click();
      assert.ok(!await browser.$('td*=PELH').isDisplayed());
      assert.ok(await browser.$('//td/a[normalize-space(text())="John Smith"]/ancestor::tr/td[*/text()="NPRC"]').isDisplayed());
    });

    it('can add a new PELH to individual PEL establishment', async() => {
      await browser.withUser('holc');
      await gotoProfile(browser, 'John Smith', 'Small Pharma');
      await browser.$('a=Add role').click();

      // Assert NPRC isn't an option
      assert.ok(!await browser.$('.govuk-form-group').$('label*=Named person responsible for compliance (NPRC)').isDisplayed());

      await browser.$('label*=PELH').click();
      await browser.$('button=Continue').click();
      await browser.$('input[name="declaration"]').click();
      await browser.$('button=Submit').click();
      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Replace named person');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
    });

    it('replace PELH removes any existing NPRC/PELH when approved', async() => {
      await browser.withUser('inspector');
      await browser.$('a=Outstanding').click();
      const task = await findTask(browser, `a=Replace named person (PELH)`);
      await task.click();

      assert.equal(await browser.$('.page-header h1').getText(), 'Replace named person');

      assert.deepStrictEqual(await getAmendmentDetails(),
        ['PELH or NRPC', 'Dave Baker', 'John Smith']);

      await browser.$('label=Amend licence').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Amend licence').click();
    });
  });
});
