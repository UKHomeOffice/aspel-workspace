import assert from 'assert';
import castArray from 'lodash';
import { gotoProjectLandingPage } from '../../helpers/project.js';

async function completeMultiInput(browser, id, values) {
  const valuesArray = castArray(values);
  const el = await browser.$(`#${id}`);

  for (const [i, value] of valuesArray.entries()) {
    if (i > 0) {
      await el.$('..').$('button=Add another').click();
    }
    await el.$$('input[type="text"]')[i].setValue(value);
  }
}

describe('ROPS', () => {

  beforeEach(async () => {
    await browser.withUser('inspector-rops');
  });

  it('can start a new ROP', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 1');
    await browser.$('a=Reporting').click();
    await browser.$('button*=Start return').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'How to complete your return');
    await browser.$('a=Continue').click();

    await browser.$('input[name="proceduresCompleted"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="postnatal"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="endangered"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="nmbas"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="rodenticide"][value="false"]').click();
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Set up return');
    await browser.$('button=Continue').click();

    await browser.$('input[name="otherSpecies"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="reuse"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="placesOfBirth"][value="uk-licenced"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="ga"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="purposes"][value="basic"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="basicSubpurposes"][value="oncology"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="newGeneticLine"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="productTesting"][value="false"]').click();
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Check set up details');

    assert.ok(await browser.$('li=In the UK at a licensed establishment').isDisplayed());
    assert.ok(await browser.$('span=Basic research').isDisplayed());
    assert.ok(await browser.$('span=Oncology').isDisplayed());

    await browser.$('button=Continue to procedures').click();
    assert.equal(await browser.$('h1').getText(), 'Return of procedures 2021');
  });

  it('is taken to the summary step if revisited', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 1');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();
    assert.equal(await browser.$('.page-header h1').getText(), 'Check set up details');
  });

  it('can add procedures to ROPs with only one species and one purpose/subpurpose (regression)', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 1');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();

    await browser.$('button=Continue to procedures').click();

    await browser.$('a=Add procedures').click();

    await browser.$('input[name="severity"][value="mild"]').click();
    await browser.$('input[name="mild-severityNum"]').setValue('100');

    await browser.$('button=Add procedures').click();

    assert.equal(await browser.$$('table tbody tr').length, 1);
    assert.equal(await browser.$('table tbody td.species').getText(), 'Mice');
    assert.equal(await browser.$('table tbody td.severity').getText(), 'Mild');
    assert.equal(await browser.$('table tbody td.purposes').getText(), 'Basic research');
    assert.equal(await browser.$('table tbody td.subpurpose').getText(), 'Oncology');
    assert.equal(await browser.$('table tbody td.severityNum').getText(), '100');
  });

  it('can update general details, resulting in techniques step being included', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 1');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();
    await browser.$('a=Edit general details').click();

    await browser.$('a=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="endangered"][value="true"]').waitForExist();
    await browser.$('input[name="endangered"][value="true"]').click();
    await browser.$('textarea[name="endangeredDetails"]').setValue('Reason for using endangered species');
    await browser.$('button=Continue').click();

    await browser.$('input[name="nmbas"][value="true"]').waitForExist();
    await browser.$('input[name="nmbas"][value="true"]').click();
    await browser.$('input[name="generalAnaesthesia"][value="false"]').click();
    await browser.$('textarea[name="generalAnaesthesiaDetails"]').setValue('Reason for not using general anaesthesia');
    await browser.$('button=Continue').click();

    await browser.$('input[name="rodenticide"][value="true"]').waitForExist();
    await browser.$('input[name="rodenticide"][value="true"]').click();
    await browser.$('textarea[name="rodenticideDetails"]').setValue('Reason for rodenticide');
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Set up return');
    await browser.$('button=Continue').click();

    // TODO: skip completed steps
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="productTesting"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.$('label=Household product testing').click();
    await browser.$('label=Tobacco product testing').click();
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('dd=Reason for using endangered species').isDisplayed());
    assert.ok(await browser.$('dd=Reason for not using general anaesthesia').isDisplayed());
    assert.ok(await browser.$('dd=Reason for rodenticide').isDisplayed());
    assert.ok(await browser.$('li=Household product testing').isDisplayed());
    assert.ok(await browser.$('li=Tobacco product testing').isDisplayed());
  });

  it('is taken to the NHP questions if an NHP is entered', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 1');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();
    await browser.$('a=Edit animals').click();

    await browser.$('a=Continue').click();
    await browser.$('label=Yes, other animal types were used').click();
    await browser.$('summary=Non-human primates').click();
    await browser.$('label=Marmosets').click();
    await browser.$('button=Continue').click();
    // TODO: skip completed steps
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('h2=What was the place of birth for non-human primates used in procedures in 2021?').isDisplayed());
    await browser.$('label=In the UK not at a licensed establishment').click();
    await browser.$('label=Self-sustaining colony').click();
    await browser.$('label=F0 (wild caught)').click();
    await browser.$('button=Continue').click();

    // TODO: skip completed steps
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Check set up details');
    assert.ok(await browser.$('dd=In the UK not at a licensed establishment').isDisplayed());
    assert.ok(await browser.$('dd=Self-sustaining colony').isDisplayed());
    assert.ok(await browser.$('dd=F0 (wild caught)').isDisplayed());
  });

  it('can add additional purposes which require extra questions to be completed', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 1');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();
    await browser.$('a=Edit purposes').click();

    await browser.$('a=Continue').click();
    await browser.$('label=Regulatory use and routine production').click();
    const appliedResearchOption = await browser.$('label=Translational and applied research');
    await appliedResearchOption.waitForClickable();
    await appliedResearchOption.click();
    await browser.$('button=Continue').click();

    // basic subpurpose
    await browser.$('label=Other').click();
    await completeMultiInput(browser, 'basicSubpurposesOther', ['Basic sub other', 'Basic sub other 2']);
    await browser.$('button=Continue').click();

    // translational research
    await browser.$('label=Human cancer').click();
    await browser.$('label=Other human disorders').click();
    await completeMultiInput(browser, 'translationalSubpurposesOther', ['Translational sub other']);
    await browser.$('button=Continue').click();

    // regulatory and production subpurpose
    await browser.$('label=Routine production: Other').click();
    await completeMultiInput(browser, 'regulatorySubpurposesOther', ['Regulatory sub other']);
    await browser.$('label=Quality control: Batch safety testing').click();
    await browser.$('button=Continue').click();

    // for QC subpurpose
    await browser.$('label=Legislation on medicinal products for human use').click();
    await browser.$('label=Other').click();
    await completeMultiInput(browser, 'regulatoryLegislationOther', ['Regulatory leg other', 'Regulatory leg other other']);

    await browser.$('label=Legislation satisfying UK requirements only').click();
    await browser.$('button=Continue').click();

    // skip completed
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('li=Basic sub other').isDisplayed());
    assert.ok(await browser.$('li=Basic sub other 2').isDisplayed());
    assert.ok(await browser.$('div=Regulatory sub other').isDisplayed());
    assert.ok(await browser.$('li=Regulatory leg other').isDisplayed());
    assert.ok(await browser.$('li=Regulatory leg other other').isDisplayed());
    assert.ok(await browser.$('div=Translational sub other').isDisplayed());
  });

  it('allows extra species to be added', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 2');
    await browser.$('a=Reporting').click();
    await browser.$('button*=Start return').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'How to complete your return');
    await browser.$('a=Continue').click();

    await browser.$('input[name="proceduresCompleted"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="postnatal"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="endangered"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="nmbas"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="rodenticide"][value="false"]').click();
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Set up return');
    await browser.$('button=Continue').click();

    await browser.$('input[name="otherSpecies"][value="true"]').click();
    await browser.$('label=Rats').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="reuse"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="placesOfBirth"][value="uk-licenced"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="ga"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="purposes"][value="basic"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="basicSubpurposes"][value="oncology"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="newGeneticLine"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="productTesting"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue to procedures').click();

    await browser.$('a=Add procedures').click();

    assert.ok(await browser.$('label=Mice').isDisplayed());
    assert.ok(await browser.$('label=Rats').isDisplayed());
  });

  it('is redirected back to the confirm page if abandoned', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 3');
    await browser.$('a=Reporting').click();
    await browser.$('button*=Start return').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'How to complete your return');
    await browser.$('a=Continue').click();

    await browser.url('/');
    await gotoProjectLandingPage(browser, 'ROP creation test 3');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Check set up details');
    await browser.$('button=Continue return set up').click();

    assert.ok(await browser.$('h2=Were any procedures carried out and completed on any animals in 2021?').isDisplayed());
    await browser.$('input[name="proceduresCompleted"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.url('/');
    await gotoProjectLandingPage(browser, 'ROP creation test 3');

    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Check set up details');
    await browser.$('button=Continue return set up').click();

    assert.ok(await browser.$('h2=Were postnatal or free feeding animals used in 2021?').isDisplayed());
  });

  it('is taken to nil return page if condition met', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 3');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Check set up details');
    await browser.$('button=Continue return set up').click();

    await browser.$('input[name="postnatal"][value="false"]').click();
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('h1=Submit nil return').isDisplayed());
  });

  it('is taken back to nil return page from confirm if journey abandoned', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 3');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Check set up details');
    await browser.$('button=Continue return set up').click();

    assert.ok(await browser.$('h1=Submit nil return').isDisplayed(), 'User should be taken back to nil return page');

    await browser.$('a=Submit nil return').click();
    await browser.$('button=Agree and continue').click();
    await browser.$('button=Submit now').click();
    await browser.waitForSuccess();

    assert.ok(await browser.$('.govuk-panel.success').$('h1=Submitted').isDisplayed());
  });

  it('can view a submitted nil return', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 3');
    await browser.$('a=Reporting').click();
    await browser.$('a*=View submitted return').click();

    const summary = await browser.$('summary=Show set up details');
    await summary.doubleClick();

    assert.ok(await browser.$('h2=General details').isDisplayed(), 'Regression - summary can be seen for nil return');
  });

  it('can unsubmit a submitted nil return', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 3');
    await browser.$('a=Reporting').click();
    await browser.$('a*=View submitted return').click();

    await browser.$('button=Correct return').click();

    assert.ok(await browser.$('h1=Submit nil return').isDisplayed());
  });

  it('selecting multiple severities to a procedure will add multiple procedure rows', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 1');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();

    await browser.$('button=Continue to procedures').click();

    assert.equal(await browser.$$('table tbody tr').length, 1, 'should start with one row');

    await browser.$('a=Add procedures').click();

    await browser.$('label=Mice').click();

    await browser.$('label=Regulatory use and routine production').click();
    await browser.$('span=Quality control: Batch safety testing').click();
    await browser.$('label=Legislation on medicinal products for human use').click();
    assert.ok(await browser.$('span=Legislation satisfying UK requirements only').isDisplayed(), 'Expected text in place of single radio');

    await browser.$('label[for*="specialTechniqueUsed-false"]').click();

    await browser.$('label=Sub-threshold').click();
    await browser.$('input[name="sub-severityNum"]').setValue(123);

    await browser.$('label=Non-recovery').click();
    await browser.$('input[name="non-severityNum"]').setValue(456);

    await browser.$('button=Add procedures').click();
    assert.equal(await browser.$$('table tbody tr').length, 3, '2 additional rows should be added');
  });

  it('can add "other" values to procedures', async () => {
    await gotoProjectLandingPage(browser, 'ROP creation test 1');
    await browser.$('a=Reporting').click();
    await browser.$('a*=Continue return').click();

    await browser.$('button=Continue to procedures').click();

    await browser.$('a=Add procedures').click();

    await browser.$('label=Mice').click();

    await browser.$('label=Basic research').click();
    await browser.$('label=Other').click();
    await browser.$('label=Basic sub other 2').click();

    await browser.$('label[for*="specialTechniqueUsed-false"]').click();

    await browser.$('label=Sub-threshold').click();
    await browser.$('input[name="sub-severityNum"]').setValue(123);

    await browser.$('button=Add procedures').click();
    assert.ok(await browser.$('td=Basic sub other 2').isDisplayed());

    await browser.$('a=Add procedures').click();

    await browser.$('label=Mice').click();

    await browser.$('label=Regulatory use and routine production').click();
    await browser.$('label=Routine production: Other').click();
    assert.ok(await browser.$('div=Regulatory sub other').isDisplayed(), 'Expected text in place of single radio');

    await browser.$('label[for*="specialTechniqueUsed-false"]').click();

    await browser.$('label=Sub-threshold').click();
    await browser.$('input[name="sub-severityNum"]').setValue(123);

    await browser.$('button=Add procedures').click();
    assert.ok(await browser.$('td=Regulatory sub other').isDisplayed());

    const summary = await browser.$('summary=Show set up details');
    await summary.doubleClick();
    await browser.$('a=Edit purposes').click();

    await browser.$('a=Continue').click();
    assert.ok(await browser.$('input[name="purposes"][value="basic"][disabled]'));
    assert.ok(await browser.$('input[name="purposes"][value="regulatory"][disabled]'));

    await browser.$('button=Continue').click();

    assert.ok(await browser.$('input[name="basicSubpurposes"][value="other"][disabled]'));
    const input1 = await browser.$('input[value="Basic sub other 2"][disabled]');
    assert.ok(input1);
    assert.ok(input1.$('../..').$('button=Remove'));

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click(); // skip translational purpose

    assert.ok(await browser.$('input[name="regulatorySubpurposes"][value="routine-other"][disabled]'));
    const input2 = await browser.$('input[value="Regulatory sub other"][disabled]');
    assert.ok(input2);
    assert.ok(input2.$('../..').$('button=Remove'));
  });

  it('asks the NHP questions when a project has NHP species', async () => {
    await gotoProjectLandingPage(browser, 'Project with NHPs');
    await browser.$('a=Reporting').click();
    await browser.$('button*=Start return').click();
    await browser.$('a=Continue').click();

    await browser.$('input[name="proceduresCompleted"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="postnatal"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="endangered"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="nmbas"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="rodenticide"][value="false"]').click();
    await browser.$('button=Continue').click();

    assert.strictEqual(await browser.$('.page-header h1').getText(), 'Set up return');
    await browser.$('button=Continue').click();

    await browser.$('input[name="otherSpecies"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="reuse"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="placesOfBirth"][value="uk-licenced"]').click();
    await browser.$('button=Continue').click();

    assert.strictEqual(await browser.$('.page-header h1').getText(), 'Set up return: animals');
    assert.ok(await browser.$('h2=What was the place of birth for non-human primates used in procedures in 2021?').isDisplayed(), 'the NHP origin question is asked');
    assert.ok(await browser.$('h2=Where were they sourced from?').isDisplayed(), 'the NHP colony question is asked');
    assert.ok(await browser.$('h2=What was their generation (maternal line)?').isDisplayed(), 'the NHP generation question is asked');

    await browser.$('input[name="nhpsOrigin"][value="uk-licenced"]').click();
    await browser.$('input[name="nhpsColonyStatus"][value="self-sustaining"]').click();
    await browser.$('input[name="nhpsGeneration"][value="f0"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="ga"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="purposes"][value="basic"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="basicSubpurposes"][value="oncology"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="newGeneticLine"][value="false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('input[name="productTesting"][value="false"]').click();
    await browser.$('button=Continue').click();

    assert.strictEqual(await browser.$('.page-header h1').getText(), 'Check set up details');
    assert.ok(await browser.$('li=In the UK at a licensed establishment').isDisplayed());
    assert.ok(await browser.$('li=Self-sustaining colony').isDisplayed());
    assert.ok(await browser.$('li=F0 (wild caught)').isDisplayed());
  });
});
