import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';

const gotoRopsSpeciesSelect = async browser => {
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
  await browser.$('button=Continue').click();
};

describe('ROP species selector', () => {

  before(async () => {
    await browser.withUser('inspector');
  });

  it('lists standard species on the ROP if there are no other species', async () => {
    await gotoProjectLandingPage(browser, 'ROP standard species test');
    await browser.$('a=Reporting').click();
    await browser.$('button*=Start return').click();

    await gotoRopsSpeciesSelect(browser);

    assert.deepStrictEqual(await browser.$('.page-header h1').getText(), 'Set up return: animals');
    assert.ok(await browser.$('li=Mice').isDisplayed(), 'mice should be listed on the ROP');
    assert.ok(await browser.$('li=Rats').isDisplayed(), 'rats should be listed on the ROP');
  });

  it('does not preselect any species on the ROP if there are any other species', async () => {
    await gotoProjectLandingPage(browser, 'ROP other species not started');
    await browser.$('a=Reporting').click();
    await browser.$('button*=Start return').click();

    await gotoRopsSpeciesSelect(browser);

    assert.deepStrictEqual(await browser.$('.page-header h1').getText(), 'Set up return: animals');
    assert.ok(!await browser.$('li=Mice').isDisplayed(), 'mice should not be listed on the ROP');

    await browser.$('summary=Small animals').click();

    const miceCheckbox = await browser.$('input[name="_species"][value="mice"]');
    const rodentsCheckbox = await browser.$('input[name="_species"][value="other-rodents"]');

    assert.deepStrictEqual(await miceCheckbox.isSelected(), false, 'mice should not be preselected');
    assert.deepStrictEqual(await rodentsCheckbox.isSelected(), false, 'other-rodents should not be preselected');
  });

});
