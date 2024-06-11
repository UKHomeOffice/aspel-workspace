import assert from 'assert';

const taskAssertions = async (browser) => {
  assert.ok(await browser.$('.procedures-diff').$('li*=Category D competency').isDisplayed());
  assert.ok(await browser.$('.procedures-diff').$('li*=Category F type of procedure').isDisplayed());

  ['Mice', 'Rats', 'Jabu', 'Babu'].forEach(async (type) => {
    assert.ok(await browser.$('#species').$(`li=${type}`).isDisplayed(), `Expected ${type} to be in species list`);
  });

  const training = await browser.$('#training');
  assert.ok(await training.$('p*=12345').isDisplayed(), 'Expected certificate number to be displayed');
  assert.ok(await training.$('p*=04 June 2015').isDisplayed(), 'Expected date awarded to be displayed');
  assert.ok(await training.$('p*=Royal Society of Biology').isDisplayed(), 'Expected awarding body to be displayed');
  assert.ok(await training.$('li=PILA (theory)').isDisplayed(), 'Expected PILA (theory) module to be displayed');
  assert.ok(await training.$('li=PILA (skills)').isDisplayed(), 'Expected PILA (skills) module to be displayed');
  assert.ok(await training.$('li=Mice').isDisplayed(), 'Expected Mice to be displayed');
};

export { taskAssertions };
