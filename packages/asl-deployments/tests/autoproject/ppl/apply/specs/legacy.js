import assert from 'assert';
import _ from 'lodash';

const addProtocol = async (browser, title) => {
  if (!await browser.$('input[name$=".title"]').isDisplayed()) {
    console.log('Adding another protocol');
    await browser.$('button=Add another protocol').click();
    await browser.$('input[name$=".title"]').waitForExist();
  }

  await browser.$('input[name$=".title"]').setValue(title);
  await browser.$('.protocol.panel').$('button=Continue').click();

  await browser.$(`h2*=${title}`).waitForDisplayed();

  const openProtocol = await browser.$('section.protocol:last-of-type');
  await openProtocol.$('input[name$=".severity"]').setValue(_.sample(['Mild', 'Moderate', 'Severe', 'Non-recovery']));

  await openProtocol.$('h3*=Type of animals').click();
  await openProtocol.$('select[name$=".speciesId"]').selectByVisibleText('Camelids');
  await openProtocol.$('label[for*=".genetically-altered-true"]').click();
  await openProtocol.$('input[name$=".quantity"]').setValue(Math.ceil(Math.random() * 1000));
  await openProtocol.$('input[name$=".life-stages"]').setValue(_.sample('Juvenile', 'Adult', 'Pregnant female', 'Neonate'));

  await openProtocol.$('h3*=Continued use/re-use').click();
  await openProtocol.$('[name$=".continued-use"]').completeRichText();
  await openProtocol.$('[name$=".reuse"]').completeRichText();

  await openProtocol.$('h3*=Steps').click();
  await openProtocol.$('[name$=".steps"]').completeRichText();

  await openProtocol.$('h3*=Fate of animals').click();
  await openProtocol.$('label[for*=".fate-continued-use"]').click();
  await openProtocol.$('[name$=".fate-justification"]').completeRichText();

  await openProtocol.$('h3*=Adverse effects').click();
  await openProtocol.$('[name$=".adverse-effects"]').completeRichText();
};

describe('PPL Application', async () => {

  it('can apply for a PPL', async () => {
    console.log(process.env.FAST ? '*** Fast mode enabled ***' : '');

    await browser.withUser('autoproject');

    await browser.gotoEstablishment();
    await browser.$('a=Projects').click();
    await browser.$('a=Drafts').click();
    await browser.$(`a=${process.env.PROJECT_TITLE}`).click();

    assert.ok(await browser.$(`h2=${process.env.PROJECT_TITLE}`).isDisplayed());

    await browser.waitForSync();
    console.log(await browser.getUrl());
    await browser.$('a=Open application').click();

    // complete introductory details
    await browser.$('a=Introductory details').click();

    await browser.$('input[name="keyword-0"]').setValue('keyword-0');
    await browser.$('input[name="keyword-1"]').setValue('keyword-1');
    await browser.$('input[name="keyword-2"]').setValue('keyword-2');
    await browser.$('input[name="keyword-3"]').setValue('keyword-3');
    await browser.$('input[name="keyword-4"]').setValue('keyword-4');

    await browser.$('select[name="years"]').selectByVisibleText('5');
    await browser.$('select[name="months"]').selectByVisibleText('0');
    await browser.$('input[name="continuation"][value="false"]').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed introductory details');

    // complete experience
    await browser.$('a=Experience').click();
    await browser.$('[name="experience-knowledge"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed experience');

    // complete resources
    await browser.$('a=Resources').click();
    await browser.$('[name="other-resources"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed resources');

    // complete establishments
    await browser.$('a=Establishments').click();
    await browser.$('input[name="other-establishments"][value="true"]').click();
    await browser.$('.control-panel').$('button=Continue').click();

    await browser.$('label=Marvell Pharmaceutical').click();
    await browser.$('[name$="establishment-about"]').completeRichText();
    await browser.$('[name$="establishment-supervisor"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed establishments');

    // complete POLES
    await browser.$('a=Places other than a licensed establishment (POLES)').click();
    await browser.$('[name="poles-list"]').completeRichText();
    await browser.$('[name="poles-justification"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed POLES');

    // complete background
    await browser.$('a=Background').click();
    await browser.$('[name="background"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed background');

    // complete benefits
    await browser.$('a=Benefits').click();
    await browser.$('[name="benefits"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed benefits');

    // complete references
    await browser.$('a=References').click();
    await browser.$('[name="references"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed references');

    // complete purpose
    await browser.$('a=Purpose').click();

    await browser.$('input[name="purpose"][value="purpose-a"]').click();
    await browser.$('input[name="purpose"][value="purpose-b"]').click();
    await browser.$('input[name="purpose-b"][value="purpose-b1"]').click();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed purpose');

    // complete aims and objectives
    await browser.$('a=Aims and objectives').click();
    await browser.$('[name="aims"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed aims and objectives');

    // complete project plan
    await browser.$('a=Project plan').click();
    await browser.$('[name="plan"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed project plan');

    // complete replacement
    await browser.$('a=Replacement').click();
    await browser.$('[name="replacement"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed replacement');

    // complete reduction
    await browser.$('a=Reduction').click();
    await browser.$('[name="reduction"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed reduction');

    // complete refinement
    await browser.$('a=Refinement').click();
    await browser.$('[name="refinement"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed refinement');

    // complete refinement
    await browser.$('a=Origin').click();
    await browser.$('[name="origin"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed origin');

    // protocols
    await browser.$('a=Protocols').click();

    await addProtocol(browser, 'Protocol 1 title');
    await addProtocol(browser, 'Protocol 2 title');

    await browser.$('a.sections-link').click();

    console.log('Completed protocols');

    // complete Cats, dogs, primates, and equidae
    await browser.$('a=Cats, dogs, primates, and equidae').click();
    await browser.$('[name="domestic"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed cats, dogs, primates and equidae');

    // complete endangered animals
    await browser.$('a=Endangered animals').click();
    await browser.$('[name="endangered"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed endangered animals');

    // complete animals taken from the wild
    await browser.$('a=Animals taken from the wild').click();
    await browser.$('[name="wild"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed animals taken from the wild');

    // complete marmosets
    await browser.$('a=Marmosets').click();
    await browser.$('[name="marmosets"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed marmosets');

    // complete feral animals
    await browser.$('a=Feral animals').click();
    await browser.$('[name="feral"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed feral animals');

    // complete neuromuscular blocking agents (NMBAs)
    await browser.$('a=Neuromuscular blocking agents (NMBAs)').click();
    await browser.$('[name="nmbas"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed neuromuscular blocking agents (NMBAs)');

    // complete NTS project summary
    await browser.$('a=Project summary').click();
    await browser.$('[name="nts-objectives"]').completeRichText();
    await browser.$('[name="nts-benefits"]').completeRichText();
    await browser.$('[name="nts-numbers"]').completeRichText();
    await browser.$('[name="nts-adverse-effects"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed project summary');

    // complete NTS replacement
    await browser.$$('a=Replacement')[1].click();
    await browser.$('[name="nts-replacement"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed NTS replacement');

    // complete NTS reduction
    await browser.$$('a=Reduction')[1].click();
    await browser.$('[name="nts-reduction"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed NTS reduction');

    // complete NTS refinement
    await browser.$$('a=Refinement')[1].click();
    await browser.$('[name="nts-refinement"]').completeRichText();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    console.log('Completed NTS refinement');

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
