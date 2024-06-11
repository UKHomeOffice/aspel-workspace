import assert from 'assert';

describe('Task assignment', () => {

  before(async() => {
    await browser.withUser('inspector');
  });

  beforeEach(async() => {
    await browser.url('/');
    await browser.$('a=Outstanding').click();
    await browser.$('table:not(.loading)').waitForExist();
  });

  it('can assign a task to self', async() => {
    await browser.$('//span[text()="Internal assign test"]/preceding-sibling::a[span/text()="New approved area"]').click();
    await browser.$('button=Assign to me').click();
    await browser.waitForSuccess();

    const [by, to] = await browser.$$('.log-item p');
    assert.equal(await by.getText(), 'Assigned by: Inspector Morse');
    assert.equal(await to.getText(), 'Assigned to: Inspector Morse');
    await browser.url('/');
    await browser.$('//span[text()="Internal assign test"]/ancestor::tr//a[//text()="Inspector Morse"]').click();
  });

  it('can assign a task to another ASRU user', async() => {
    // await browser.$('//span[text()="Internal assign test"]/preceding-sibling::a[span/text()="New approved area"]').click();
    await browser.$('//span[text()="Internal assign test"]/ancestor::tr//a[//text()="New approved area"]').click();
    await (await browser.$('select#assignedTo')).selectByVisibleText('Licensing Officer');
    await browser.$('button=Assign').click();
    await browser.waitForSuccess();

    const [by, to] = await browser.$$('.log-item p');
    assert.equal(await by.getText(), 'Assigned by: Inspector Morse');
    assert.equal(await to.getText(), 'Assigned to: Licensing Officer');
    await browser.url('/');
    await browser.$('a=Outstanding').click();
    await browser.$('table:not(.loading)').waitForExist();
    assert.ok(await browser.$('//span[text()="Internal assign test"]/ancestor::tr//a[//text()="Licensing Officer"]').isDisplayed());
  });

  it('can assign and unassign a task', async() => {
    await browser.$('//span[text()="Internal assign test"]/ancestor::tr//a[//text()="New approved area"]').click();
    await browser.$('select#assignedTo').selectByVisibleText('Unassigned');
    await browser.$('button=Assign').click();
    await browser.waitForSuccess();

    const [by, to] = await browser.$$('.log-item p');
    assert.equal(await by.getText(), 'Assigned by: Inspector Morse');
    assert.equal(await to.getText(), 'Assigned to: Unassigned');
    await browser.url('/');
    await browser.$('a=Outstanding').click();
    await browser.$('table:not(.loading)').waitForExist();
    assert.ok(await browser.$('//span[text()="Internal assign test"]/ancestor::tr//td[//text()="Unassigned"]').isDisplayed());
  });

  it('preserves task assignment when moving status', async() => {
    await browser.$('//span[text()="Internal assign test"]/ancestor::tr//a[//text()="New approved area"]').click();
    await browser.$('button=Assign to me').waitForExist();
    await browser.$('button=Assign to me').click();
    await browser.waitForSuccess();

    await browser.$('label=Return amendment with comments').click();
    await browser.$('button=Continue').click();

    await browser.$('textarea[name="comment"]').setValue('Reasons');
    await browser.$('button=Return amendment with comments').click();
    await browser.waitForSuccess();

    await browser.$('a=View task').click();

    assert.ok(await browser.$('#asru-assignment').$('p=Assigned to: Inspector Morse').isDisplayed());
  });
});
