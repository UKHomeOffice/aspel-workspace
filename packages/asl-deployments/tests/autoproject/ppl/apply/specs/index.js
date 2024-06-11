import assert from 'assert';

const continueAndComplete = async browser => {
  await browser.$('.control-panel').$('button=Continue').click();
  await browser.$('input[name="complete"][value="true"]').click();
  await browser.$('button=Continue').click();
};

const addProtocol = async (browser, title) => {
  console.log(`Starting protocol '${title}'`);

  // if there's a completed protocol then add another
  if (await browser.$('section.protocol.complete').isDisplayed()) {
    await browser.$('button=Add another protocol').click();
    await browser.$('input[name$=".title"]').waitForExist();
  }

  await browser.$('.protocol.panel').$('input[name$=".title"]').setValue(title);
  await browser.pause(500);
  await browser.$('.protocol.panel').$('button=Continue').click();

  await browser.waitForSync();
  const openProtocol = await browser.$('.protocol:not(.complete)');

  await openProtocol.$('[name$=".description"]').completeRichText();
  await openProtocol.$('input[name$=".severity"][value="moderate"]').click();
  await openProtocol.$('[name$=".severity-proportion"]').completeRichText();
  await openProtocol.$('[name$=".severity-details"]').completeRichText();
  await openProtocol.$('input[name$=".locations"][value="University of Croydon"]').click();
  // results in POLE condition being added to protocol
  await openProtocol.$('input[name$=".locations"][value="First POLE"]').click();
  console.log('  Completed details');

  await openProtocol.$('h3*=Animals used in this protocol').click();
  await openProtocol.$('input[name$=".species"][value="mice"]').click();
  await openProtocol.$('input[name$=".life-stages"][value="adult"]').click();
  // results in "continued use on to a protocol" condition being added to protocol
  await openProtocol.$('input[name$=".continued-use"][value="true"]').click();
  // results in reuse condition being added to protocol
  await openProtocol.$('input[name$=".reuse"][value="true"]').click();
  await openProtocol.$('input[name$=".maximum-animals"]').setValue('100');
  await openProtocol.$('input[name$=".maximum-times-used"]').setValue('1');
  console.log('  Completed animals');

  await openProtocol.$('h3*=Genetically altered animals (GAA)').click();
  // results in transfer authorisation being added to project, if one of the following species are also selected:
  // mice, rats, guinea-pigs, hamsters, gerbils, other-rodents, common-frogs, african-frogs, zebra-fish
  await openProtocol.$('input[name$=".gaas"][value="true"]').click();
  console.log('  Completed GAAs');

  await openProtocol.$('h3*=Steps').click();
  await openProtocol.$('[name$=".title"]').completeRichText();

  await openProtocol.$('input[name$=".optional"][value="false"]').click();
  await openProtocol.$('input[name$=".adverse"][value="false"]').click();
  await openProtocol.$('button=Save step').click();
  await openProtocol.$('button=Add another step').click();
  await openProtocol.$('[name$=".title"]').completeRichText();
  await openProtocol.$('input[name$=".optional"][value="false"]').click();
  await openProtocol.$('input[name$=".adverse"][value="false"]').click();
  await openProtocol.$('button=Save step').click();
  console.log('  Completed steps');

  await openProtocol.$('h3*=Animal experience').click();
  await openProtocol.$('[name$=".experience-summary"]').completeRichText();
  await openProtocol.$('[name$=".experience-endpoints"]').completeRichText();
  console.log('  Completed experience');

  await openProtocol.$('h3*=Experimental design').click();
  await openProtocol.$('[name$=".outputs"]').completeRichText();
  await openProtocol.$('input[name$=".quantitative-data"][value="false"]').click();
  console.log('  Completed experimental design');

  await openProtocol.$('h3*=Protocol justification').click();
  await openProtocol.$('[name$=".most-appropriate"]').completeRichText();
  await openProtocol.$('[name$=".most-refined"]').completeRichText();
  await openProtocol.$('[name$=".scientific-endpoints"]').completeRichText();
  await openProtocol.$('[name$=".scientific-suffering"]').completeRichText();
  await openProtocol.$('[name$=".scientific-endpoints-justification"]').completeRichText();
  await openProtocol.$('input[name$=".justification-substances"][value="false"]').click();
  console.log('  Completed justification');

  await openProtocol.$('h3*=Fate of animals').click();
  await openProtocol.$('input[name$=".fate"][value="killed"]').click();
  // results in continued use on another protocol in same project
  await openProtocol.$('input[name$=".fate"][value="continued-use"]').click();
  // results in continued use in another project
  await openProtocol.$('input[name$=".fate"][value="continued-use-2"]').click();
  console.log('  Completed fate');

  await openProtocol.$('input[name="complete"][value="true"]').click();
  await openProtocol.$('button=Continue').click();
  console.log(`Completed protocol '${title}'`);
};

describe('PPL Application', async () => {

  it('can apply for a PPL', async () => {
    let complete = 0;
    console.log(process.env.FAST ? '*** Fast mode enabled ***' : '');

    await browser.withUser('autoproject');

    await browser.gotoEstablishment();
    await browser.$('a=Projects').click();
    await browser.$('button=Apply for project licence').click();

    assert.ok(await browser.$('h2=Untitled project').isDisplayed());
    console.log('Created project');
    // complete introductory details
    await browser.$('a=Introductory details').click();

    await browser.$('input[name="title"]').setValue(process.env.PROJECT_TITLE);

    await browser.$('[name="training-licence"][value="false"]').click();
    await browser.$('[name="permissible-purpose"][value="basic-research"]').click();

    await browser.$('select[name="years"]').selectByVisibleText('5');
    await browser.$('select[name="months"]').selectByVisibleText('0');
    await browser.$('summary=Small animals').click();
    await browser.$('input[name="SA"][value="mice"]').click();
    await browser.$('input[name="SA"][value="rats"]').click();
    await browser.$('summary=Non-human primates').click();
    // results in marmosets condition if "marmoset-colony" is also false.
    await browser.$('input[name="NHP"][value="marmosets"]').click();
    await continueAndComplete(browser);

    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    await console.log(`Project title is '${process.env.PROJECT_TITLE}'`);
    await console.log('Completed introductory details');

    // complete aims
    await browser.$('a=Aims').click();
    await browser.$('.nts').$('button=Continue').click();
    await browser.$('[name$="project-aim"]').completeRichText();
    await browser.$('[name$="project-importance"]').completeRichText();

    await browser.$('input[name="keyword-0"]').setValue('keyword-0');
    await browser.$('input[name="keyword-1"]').setValue('keyword-1');
    await browser.$('input[name="keyword-2"]').setValue('keyword-2');
    await browser.$('input[name="keyword-3"]').setValue('keyword-3');
    await browser.$('input[name="keyword-4"]').setValue('keyword-4');
    await continueAndComplete(browser);
    assert.equal(await browser.$$('.badge.complete').length, ++complete);
    console.log('Completed aims');

    // complete benefits
    await browser.$('a=Benefits').click();
    await browser.$('.nts').$('button=Continue').click();
    await browser.$('[name$="benefit-outputs"]').completeRichText();
    await browser.$('[name$="benefit-who"]').completeRichText();
    await browser.$('input[name="benefit-service"][value="true"]').click();
    await browser.$('[name$="benefit-service-benefits"]').completeRichText();
    await browser.$('[name$="benefit-maximise-outputs"]').completeRichText();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed benefits');

    // complete project harms
    await browser.$('a=Project harms').click();
    await browser.$('.nts').$('button=Continue').click();
    await browser.$('[name$="project-harms-animals"]').completeRichText();
    await browser.$('[name$="project-harms-summary"]').completeRichText();
    await browser.$('[name$="project-harms-effects"]').completeRichText();
    await browser.$('[name$="project-harms-severity"]').completeRichText();
    await browser.$('[name$="project-harms-animals"]').completeRichText();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed project harms');

    // complete fate of animals
    await browser.$('a=Fate of animals').click();
    await browser.$('.nts').$('button=Continue').click();
    // results in rehoming authorisation being added to project.
    await browser.$('input[name="fate-of-animals"][value="rehomed"]').click();
    // results in setting-free authorisation being added to project.
    await browser.$('input[name="fate-of-animals"][value="set-free"]').click();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed fate of animals');

    // complete replacement
    await browser.$('a=Replacement').click();
    await browser.$('.nts').$('button=Continue').click();
    await browser.$('[name$="replacement-why"]').completeRichText();
    await browser.$('[name$="replacement-alternatives"]').completeRichText();
    await browser.$('[name$="replacement-justification"]').completeRichText();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed replacement');

    // complete reduction
    await browser.$('a=Reduction').click();
    await browser.$('.nts').$('button=Continue').click();
    await browser.$('input[name="reduction-quantities-mice"]').setValue('100');
    await browser.$('input[name="reduction-quantities-rats"]').setValue('100');
    await browser.$('[name$="reduction-estimation"]').completeRichText();
    await browser.$('[name$="reduction-steps"]').completeRichText();
    await browser.$('[name$="reduction-review"]').completeRichText();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed reduction');

    // complete refinement
    await browser.$('a=Refinement').click();
    await browser.$('.nts').$('button=Continue').click();
    await browser.$('[name$="refinement-models"]').completeRichText();
    await browser.$('[name$="refinement-less-sentient"]').completeRichText();
    await browser.$('[name$="refinement-3rs-advances"]').completeRichText();
    await browser.$('[name$="refinement-explaination"]').completeRichText();
    await browser.$('[name$="refinement-published-guidance"]').completeRichText();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed refinement');

    // complete experience
    await browser.$('a=Experience').click();
    await browser.$('input[name="experience-projects"][value="true"]').click();
    await browser.$('[name$="experience-achievements"]').completeRichText();
    await browser.$('[name$="experience-knowledge"]').completeRichText();
    await browser.$('[name$="experience-animals"]').completeRichText();
    await browser.$('[name$="experience-experimental-design"]').completeRichText();
    await browser.$('[name$="experience-others"]').completeRichText();
    await browser.$('[name$="funding-previous"]').completeRichText();
    await continueAndComplete(browser);

    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed experience');

    // complete funding
    await browser.$('a=Funding').click();
    await browser.$('[name$="funding-how"]').completeRichText();
    await browser.$('input[name="funding-basic-translational"][value="true"]').click();
    await browser.$('[name$="funding-reviewed"]').completeRichText();
    await continueAndComplete(browser);

    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed funding');

    // complete training
    await browser.$('a=Training').click();
    await browser.$('input[name="training-complete"][value="true"]').click();
    await browser.$('button=Continue').click();

    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed training');

    // complete establishments
    await browser.$('a=Establishments').click();
    await browser.$('input[name="other-establishments"][value="true"]').click();
    await browser.$('.control-panel').$('button=Continue').click();

    await browser.$('label=Marvell Pharmaceutical').click();
    await browser.$('[name$="establishment-about"]').completeRichText();
    await browser.$('[name$="establishment-supervisor"]').completeRichText();
    await browser.$('.control-panel').$('button=Continue').click();

    // resuls in code-of-practice condition being added to project
    await browser.$('input[name="establishments-care-conditions"][value="false"]').click();
    await browser.$('[name$="establishments-care-conditions-justification"]').completeRichText();

    await continueAndComplete(browser);

    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed establishments');

    // complete transfer and movement of animals
    await browser.$('a=Transfer and movement of animals').click();
    await browser.$('input[name="transfer"][value="true"]').click();
    await browser.$('[name$="transfer-why"]').completeRichText();
    await browser.$('[name$="transfer-how"]').completeRichText();
    await browser.$('[name$="transfer-measures"]').completeRichText();
    await browser.$('input[name="transfer-recovery"][value="true"]').click();
    await browser.$('input[name="transfer-acclimatisation"][value="true"]').click();
    await continueAndComplete(browser);

    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed transfer and movement');

    // complete poles
    await browser.$('a=Places other than a licensed establishment (POLEs)').click();
    await browser.$('input[name="poles"][value="true"]').click();
    await browser.$('[name$="poles-justification"]').completeRichText();
    await browser.$('.control-panel').$('button=Continue').click();

    // results in the POLEs condition being added to the project
    await browser.$('input[name$=".title"]').setValue('First POLE');
    await browser.$('[name$=".pole-info"]').completeRichText();
    await browser.$('.control-panel').$('button=Continue').click();

    await browser.$('[name$="poles-inspection"]').completeRichText();
    await browser.$('[name$="poles-environment"]').completeRichText();
    await browser.$('input[name="poles-transfer"][value="false"]').click();
    await continueAndComplete(browser);

    assert.equal(await browser.$$('.badge.complete').length, ++complete);
    console.log('Completed POLES');

    // complete scientific background
    await browser.$('a=Scientific background').click();
    await browser.$('input[name="scientific-background-basic-translational"][value="true"]').click();
    await browser.$('[name$="scientific-knowledge-summary"]').completeRichText();
    await browser.$('[name$="scientific-knowledge-details"]').completeRichText();
    await browser.$('input[name="clinical-condition"][value="false"]').click();

    await browser.$('input[name="scientific-background-producing-data"][value="false"]').click();
    await browser.$('input[name="scientific-background-non-regulatory"][value="false"]').click();
    await browser.$('input[name="scientific-background-genetically-altered"][value="false"]').click();
    await browser.$('input[name="scientific-background-vaccines"][value="false"]').click();
    // results in continuation authorisation being added to project
    await browser.$('input[name="transfer-expiring"][value="true"]').click();
    await browser.$('input[name$=".licence-number"]').setValue('P12345678');
    await browser.$('input[name$=".expiry-date-day"]').setValue('01');
    await browser.$('input[name$=".expiry-date-month"]').setValue('01');
    await browser.$('input[name$=".expiry-date-year"]').setValue('2022');

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed scientific background');

    // complete action plan
    await browser.$('a=Action plan').click();
    await browser.$('input[name$=".title"]').setValue('First objective');
    await browser.$('[name$="objective-relation"]').completeRichText();
    await browser.$('.control-panel').$('button=Continue').click();

    await browser.$('[name$="objectives-alternatives"]').completeRichText();
    await browser.$('input[name="objectives-regulatory-authorities"][value="false"]').click();
    await browser.$('input[name="objectives-non-regulatory"][value="false"]').click();
    await browser.$('input[name="objectives-genetically-altered"][value="false"]').click();
    await browser.$('input[name="objectives-vaccines"][value="false"]').click();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed action plan');

    // complete general principles
    await browser.$('a=General principles').click();
    await browser.$('[name$="general-principles-duplicate"]').completeRichText();
    await browser.$('input[name="experimental-design-sexes"][value="true"]').click();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed general principles');

    // complete protocols
    await browser.$('a=Protocols').click();

    await addProtocol(browser, 'Protocol 1 title');
    await addProtocol(browser, 'Protocol 2 title');

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed protocols');

    // complete NHPs
    await browser.$('a=Non-human primates').click();
    await browser.$('[name$="nhps"]').completeRichText();
    await browser.$('input[name="nhps-endangered"][value="false"]').click();
    // there are 2 fields with the same name "nhps-justification", we only want the visible one
    await browser.$$('[name="nhps-justification"]')
      .find(elem => elem.isDisplayed())
      .completeRichText();

    await browser.$('input[name="wild-caught-primates"][value="false"]').click();
    // results in marmosets condition being added (if marmosets also selected in species)
    await browser.$('input[name="marmoset-colony"][value="false"]').click();
    await browser.$('[name$="marmoset-colony-justification"]').completeRichText();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed NHPs');

    // complete purpose bred animals
    await browser.$('a=Purpose bred animals').click();
    // results in 'non-purpose-bred-sched-2' condition being added to project
    await browser.$('input[name="purpose-bred"][value="false"]').click();
    await browser.$('[name$="purpose-bred-sourced"]').completeRichText();
    await browser.$('[name$="purpose-bred-justification"]').completeRichText();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed purpose bred animals');

    // complete endangered animals
    await browser.$('a=Endangered animals').click();
    await browser.$('input[name="endangered-animals"][value="false"]').click();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed endangered animals');

    // complete animals taken from the wild
    await browser.$('a=Animals taken from the wild').click();
    // results in wild condition being added to project
    await browser.$('input[name="wild-animals"][value="true"]').click();
    await browser.$('[name$="wild-animals-justification"]').completeRichText();
    await browser.$('[name$="wild-animals-caught"]').completeRichText();
    await browser.$('[name$="wild-animals-potential-harms"]').completeRichText();
    await browser.$('input[name="non-target-species-capture-methods"][value="false"]').click();
    await browser.$('[name$="wild-animals-competence"]').completeRichText();
    await browser.$('[name$="wild-animals-examine"]').completeRichText();
    await browser.$('input[name="wild-animals-vet"][value="true"]').click();
    await browser.$('input[name="wild-animals-poor-health"][value="false"]').click();

    await browser.$('button=Continue').click();
    await browser.$('[name$="wild-animals-transport"]').completeRichText();
    await browser.$('[name$="wild-animals-killing-method"]').completeRichText();
    await browser.$('input[name="wild-animals-marked"][value="false"]').click();
    await browser.$('input[name="wild-animals-devices"][value="false"]').click();
    await browser.$('input[name="wild-animals-declaration"][value="true"]').click();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed animals taken from wild');

    // complete feral animals
    await browser.$('a=Feral animals').click();
    // results in feral condition being added to project
    await browser.$('input[name="feral-animals"][value="true"]').click();
    await browser.$('[name$="feral-animals-justification"]').completeRichText();
    await browser.$('[name$="feral-animals-essential"]').completeRichText();
    await browser.$('[name$="feral-animals-procedures"]').completeRichText();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete').length), ++complete);
    console.log('Completed feral animals');

    // complete NMBAs
    await browser.$('a=Neuromuscular blocking agents (NMBAs)').click();
    await browser.$('input[name="nmbas-used"][value="true"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();
    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed NMBAs');

    // complete reusing-animals
    await browser.$('a=Re-using animals').click();
    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed re-using animals');

    // complete setting free
    await browser.$('a=Setting animals free').click();
    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed setting animals free');

    // complete rehoming
    await browser.$('a=Rehoming animals').click();
    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed Rehoming animals');

    // complete commercial slaugher
    await browser.$('a=Commercial slaughter').click();
    // results in slaughter authorisation being added to project
    await browser.$('input[name="commercial-slaughter"][value="true"]').click();
    await browser.$('[name$="commercial-slaughter-hygiene"]').completeRichText();

    await continueAndComplete(browser);
    assert.equal((await browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed commercial slaughter');

    // complete human material
    await browser.$('a=Animals containing human material').click();
    await browser.$('input[name="animals-containing-human-material"][value="false"]').click();

    await continueAndComplete(browser);
    assert.equal(await (browser.$$('.badge.complete')).length, ++complete);
    console.log('Completed human material');

    // submit application
    await browser.waitForSync();
    await browser.$('button=Continue').click();

    await browser.$('button=Submit PPL application').click();

    assert.equal(await browser.$('.page-header h1').getText(), 'Project application');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
    console.log('Submitted application');

    await browser.url('/');
    await browser.$('a=In progress').click();

    assert.ok(await browser.$('a=PPL application').isDisplayed());
  });

});
