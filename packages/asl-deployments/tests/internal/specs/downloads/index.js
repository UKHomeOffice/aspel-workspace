import assert from 'assert';

describe('downloads', () => {

  it('asru support can access downloads page', async () => {
    await browser.withUser('asrusupport');
    await browser.$('footer').$('a=Downloads').click();
    await assert.ok(browser.$('h1=Downloads').isDisplayed());
  });

  it('can download a list of protocols', async () => {
    await browser.withUser('asrusupport');
    await browser.$('footer').$('a=Downloads').click();
    const csv = await browser.$('a=Project protocols').download('csv');
    assert.ok(csv.find(r => r.projectLicenceNumber === 'PR-ALL-BOXES-LEGACY'));
  });

  it('can download a list of PPL applications', async () => {
    await browser.withUser('asrusupport');
    await browser.$('footer').$('a=Downloads').click();
    const applicationsCsv = await browser.$('a*=Project applications').download('csv');
    const project = await applicationsCsv.find(r => r.licenceNumber === 'PP2617822');

    assert.ok(project, 'There should be a row with the licence number PP2617822');
    assert.deepStrictEqual(project.title, 'Project with task history', 'It should contain the project title');
    assert.deepStrictEqual(project.licenceHolder, 'Imojean Addlestone', 'It should contain the licence holder');
    assert.deepStrictEqual(project.iterations, '2', 'It should have 2 iterations');
    assert.deepStrictEqual(project.wasExtended, 'Yes', 'It should flag the deadline was extended');
    assert.deepStrictEqual(project.extendedReason, 'Extend deadline', 'It should display the reason the deadline was extended');
  });

});
