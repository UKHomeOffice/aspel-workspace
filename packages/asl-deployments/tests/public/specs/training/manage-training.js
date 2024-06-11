import assert from 'assert';

async function visitTrainingPage(browser) {
  await browser.url('/');
  await browser.$('h3=University of Croydon').click();
  await browser.$('a=Go to University of Croydon').click();
  await browser.$$('p.holc').find(async el => await el.getText() === 'Bruce Banner').click();
  await browser.$('a=Manage training').click();
}

async function selectModule(browser, module) {
  await browser
    .$('#modules')
    .$(`label*=${module}`)
    .click();
}

async function addSpecies(browser) {
  await browser.$('summary=Small animals').click();
  await browser.$('label=Mice').click();
  await browser.$('label=Rats').click();
  await browser.$('summary=Other').click();
  await browser.$('.multi-input-item input').waitForDisplayed();
  await browser.$('.multi-input-item input').setValue('Jabu');
  await browser.$('button=Add another').click();
  await browser.$('.multi-input-item:last-of-type input').waitForDisplayed();
  await browser.$('.multi-input-item:last-of-type input').setValue('Babu');
}

describe('Manage training', () => {
  beforeEach(async () => {
    await browser.withUser('holc');
    await visitTrainingPage(browser);
  });

  it('Can add a training certificate', async () => {
    await browser.$('a=Add training or exemption').click();
    await browser.$('label[for*="isExemption-false"]').click();
    await browser.$('button=Continue').click();
    await browser.$('input[name=certificateNumber]').setValue('11111');
    await browser
      .$('#accreditingBody')
      .$('label=Universities Accreditation Group')
      .click();

    await browser.$('input[name=passDate-day]').setValue('12');
    await browser.$('input[name=passDate-month]').setValue('12');
    await browser.$('input[name=passDate-year]').setValue('2011');

    await browser.$('button=Continue').click();

    await selectModule(browser, 'E1');
    await selectModule(browser, 'PILA (theory)');

    await browser.$('button=Continue').click();
    await addSpecies(browser);
    await browser.$('button=Submit').click();

    const row = await browser.$('td*=11111').$('..');
    assert(await row.$('td*=11111').isDisplayed());
    assert(await row.$('td*=Universities Accreditation Group').isDisplayed());
    assert(await row.$('td*=12 December 2011').isDisplayed());
    assert(await row.$('li=E1').isDisplayed());
    assert(await row.$('li=PILA (theory)').isDisplayed());
    assert(await row.$('li=Mice').isDisplayed());
    assert(await row.$('li=Rats').isDisplayed());
    assert(await row.$('li=Jabu').isDisplayed());
    assert(await row.$('li=Babu').isDisplayed());
  });

  it('can add an exemption', async () => {
    await browser.$('a=Add training or exemption').click();
    await browser.$('label[for*="isExemption-true"]').click();
    await browser.$('button=Continue').click();
    await browser.$('[name="exemptionReason"]').setValue('Years of experience');
    await selectModule(browser, 'E1');
    await selectModule(browser, 'PILA (theory)');
    await browser.$('button=Continue').click();
    await addSpecies(browser);
    await browser.$('button=Submit').click();
    const row = await browser.$('td=Exemption').$('..');
    assert.ok(await row.$('td=Exemption').isDisplayed());
    assert.ok(await row.$('td=Years of experience').isDisplayed());
  });

  it('can update an exemption', async () => {
    await browser.$('td=Exemption').$('..').$('a=Edit').click();
    await browser.$('[name="exemptionReason"]').setValue('New description');
    await browser.$('button=Continue').click();
    await browser.$('button=Submit').click();
    const row = await browser.$('td=Exemption').$('..');
    assert.ok(await row.$('td=New description').isDisplayed());
  });

  it('can delete an exemption', async () => {
    await browser.$('tr*=Exemption').$('button=Delete').click();
    await browser.acceptAlert();
    assert.ok(!await browser.$('td=Exemption').isDisplayed());
  });

  it('can update a certificate that has no species', async () => {
    await browser.$('td=L').$('..').$('a=Edit').click();
    await browser.$('button=Continue').click();
    await selectModule(browser, 'PILA (theory)');
    await browser.$('button=Continue').click();
    await addSpecies(browser);
    await browser.$('button=Submit').click();

    const row = await browser.$('td*=1234567890').$('..');
    assert(await row.$('li=L').isDisplayed());
    assert(await row.$('li=PILA (theory)').isDisplayed());
    assert(await row.$('li=Mice').isDisplayed());
    assert(await row.$('li=Rats').isDisplayed());
    assert(await row.$('li=Jabu').isDisplayed());
    assert(await row.$('li=Babu').isDisplayed());
  });
});
