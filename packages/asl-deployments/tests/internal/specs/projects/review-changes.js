import assert from 'assert';

const waitForDiff = async browser => {
  // TODO: The following 2 commented lines weren't working after wdio were
  // upgraded to 8.x. Keeping them here commented out, for future reference.
  // If test passes consistently in the pipeline, they can then be deleted
  // await browser.$('.diff-window').$('p=Loading...').waitForDisplayed();
  // await browser.$('.diff-window').$('p=Loading...').waitForExist({ reverse: true });

  await browser.$('.diff-window').waitForDisplayed();
};

describe('Review PPL amendment', () => {
  before(async () => {
    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await browser.$(`[title="Amend in prog project"]`).$('a=PPL amendment').click();
    await browser.$('a=View latest submission').click();
  });

  it('shows a changed indicator in the "Introductory details" section', async () => {
    const span = await browser.$('//a[normalize-space(text())="Introductory details"]/ancestor::tr//span[text()="changed"]');
    assert.ok(span.isDisplayed());
  });

  it('shows a changed indicator against the project title', async () => {
    await browser.$('a=Introductory details').click();
    assert.ok(await (await browser.$(`h3=What's the title of this project?`).closest('.review')).$('span=changed').isDisplayed());
  });

  it('compares answers in diff window', async () => {
    const link = await browser.$(`//h3[text()="What's the title of this project?"]/ancestor::*[@class="review"]//a[text()="See what's changed"]`);
    await link.click();
    await waitForDiff(browser);

    assert.ok(browser.$('.diff-window').$('p=Amend in prog project').isDisplayed());
    assert.ok(browser.$('.diff-window').$('p=Amend in prog project 2').isDisplayed());
    const span = await browser.$('.diff-window span.diff.added');
    assert.equal(await span.getText(), '2');
    await browser.$('a=Close').click();
  });

  it('focus stays within compare dialog on tab navigation', async () => {
    await browser.$(`a=See what's changed`).click();
    await browser.$('.diff-window').waitForDisplayed();

    // Check several 'Tabs' keep focus within modal
    await browser.keys(['Tab', 'Tab', 'Tab', 'Tab']);

    const activeElement = await browser.$(async function () {
      return document.activeElement;
    });

    // Check activeElement within modal-content
    assert.ok(await activeElement.$('//div[@class="modal-content"]').isExisting());
  });

  it('compare dialog can be closed with Escape key', async () => {
    await browser.keys('Escape');
    assert.ok(!await browser.$('.diff-window').isDisplayed());
  });

});

describe('Review application', () => {

  before(async () => {
    await browser.withUser('inspector');
    await browser.gotoOutstandingTasks();
    await browser.$('[title="Draft Application"] a').click();
    await browser.$('a=View latest submission').click();
  });

  it('compares answers inside reveals inside nested repeaters (regression)', async () => {
    await browser.$('a=Protocols').click();
    assert.ok(browser.$('.protocol .badge.changed').isDisplayed());

    await browser.$('.protocol .header').click();
    assert.ok(browser.$('.protocol section.steps .badge.changed').isDisplayed());
    await browser.$('.protocol section.steps h3').click();
    await browser.$(`a*=Open all steps`).click();

    const link = await browser.$(`//h3[text()="What are the likely adverse effects of this step?"]/ancestor::*[@class="review"]//a[text()="See what's changed"]`);
    await link.click();

    await waitForDiff(browser);

    assert.ok(browser.$('.diff-window .before').$('p=Adverse effects').isDisplayed());
    assert.ok(browser.$('.diff-window .after').$('p=Changed effects').isDisplayed());
    assert.equal(await browser.$('.diff-window .before span.diff.removed').getText(), 'Adverse');
    assert.equal(await browser.$('.diff-window .after span.diff.added').getText(), 'Changed');
    await browser.$('a=Close').click();
  });

});
