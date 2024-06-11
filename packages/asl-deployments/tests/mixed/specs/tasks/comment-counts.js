import assert from 'assert';

describe('PPL Comment Counts', () => {
  before(async () => {
    await browser.addCommand(
      'comment',
      async function (comment) {
        await this.$('button=Add comment').click();
        await this.$('textarea[name="add-new-comment"]').setValue(comment);
        await this.$('button=Save').click();
        await this.$(`p=${comment}`).waitForDisplayed();
      },
      true
    );
  });

  it('shows the correct number of new comments', async () => {
    await browser.withUser('inspector');
    await browser.$('a=Outstanding').click();
    await browser.$('//div[@title="Comment Count Test"]//a[contains(@href, "tasks")]').click();

    await browser.$('a=View latest submission').click();

    await browser.$('a=Introductory details').click();

    await browser.$('//h3[text()="What\'s the title of this project?"]/ancestor::*[@class="review"]').comment('Intro - one comment');

    await browser.$('a=List of sections').click();

    await browser.$('a=Establishments').click();

    await browser.$('//h3[text()="Will your project use any additional establishments?"]/ancestor::*[@class="review"]').comment('Establishments - one comment');

    await browser.$(
      '//h2[text()="Additional establishment 2"]' +
      '/ancestor::div[contains(@class,"panel")]' +
      '//h3[text()="Why do you need to carry out work at this additional establishment?"]' +
      '/ancestor::*[@class="review"]'
    ).comment('Establishments - two comments');

    await browser.$('a=Places other than a licensed establishment (POLEs)').click();

    await browser.$(
      '//h3[text()="Why can\'t this part of your project take place at a licensed establishment?"]' +
      '/ancestor::*[@class="review"]'
    ).comment('POLEs - one comment');

    await browser.$(
      '//h2[contains(.,"POLE 1")]' +
      '/ancestor::div[contains(@class,"panel")]' +
      '//h3[text()="Name"]' +
      '/ancestor::*[@class="review"]'
    ).comment('POLEs - two comments');

    await browser.$(
      '//h2[contains(.,"POLE 2")]' +
      '/ancestor::div[contains(@class,"panel")]' +
      '//h3[text()="Details"]' +
      '/ancestor::*[@class="review"]'
    ).comment('POLEs - three comments');

    await browser.$(
      '//h3[text()="How will work at each POLE be done in the most environmentally sensitive manner?"]' +
      '/ancestor::*[@class="review"]'
    ).comment('POLEs - four comments');

    await browser.$('a=View all sections').click();

    await browser.$('a=Protocols').click();

    const protocol1 = await browser.$$('section.protocol')[0];

    await protocol1.$('//h2[contains(.,"First protocol")]').click();
    await protocol1.$('//h3//div[text()="Protocol 1: Protocol details"]').click();

    await protocol1.$(
      '//h3[text()="Briefly describe the purposes of this protocol"]' +
      '/ancestor::*[@class="review"]'
    ).comment('Protocol 1 - one comment');
    await protocol1.$('h3=Protocol 1: Animals used in this protocol').click();

    await protocol1.$('.expanding-panel.animals').$('h3=Mice').waitForDisplayed();
    await protocol1.$(
      '//h3[text()="Which life stages will be used during this protocol?"]' +
      '/ancestor::*[@class="review"]'
    ).comment('Protocol 1 - two comments');
    await protocol1.$('h3=Mice').doubleClick(); // close Mice content

    await protocol1.$('.expanding-panel.animals').$('h3=Rats').waitForDisplayed();
    await protocol1.$(
      '//h3[text()="Will you be re-using animals on to this protocol?"]' +
      '/ancestor::*[@class="review"]'
    ).comment('Protocol 1 - three comments');

    const protocol2 = await browser.$$('section.protocol')[1];

    await protocol2.$('h2*=Second protocol').click();
    await protocol2.$('h3=Protocol 2: Steps').click();
    await protocol2.$(`a*=Open all steps`).click();

    await protocol2.$('.expanding-panel.steps').$('h3=Step one').waitForDisplayed();
    await protocol2.$(
      '//h3[text()="Describe the procedures that will be carried out during this step."]' +
      '/ancestor::*[@class="review"]'
    ).comment('Protocol 2 - one comment');

    await protocol2.$('.expanding-panel.steps').$('h3=Step two').waitForDisplayed();
    await protocol2.$(
      '//h3[contains(.,"Step two")]' +
      '//..//..' + // goes up two ancestors
      '//h3[text()="Is this step optional?"]' +
      '/ancestor::*[@class="review"]'
    ).comment('Protocol 2 - two comments');

    await browser.$('a=View all sections').click();

    await browser.$('a=Continue').click();

    await browser.$('input[name="status"][value="returned-to-applicant"]').click();
    await browser.$('button=Continue').click();

    await browser.$('textarea[name="comment"]').setValue('See comments');
    await browser.$('button=Return with comments').click();

    await browser.waitForSuccess();

    await browser.withUser('holc');

    await browser.$('//div[@title="Comment Count Test"]//a[contains(@href, "tasks")]').click();

    await browser.$('a=View latest submission').click();

    const countIntro = await browser
      .$('//a[text()="Introductory details"]/ancestor::tr//span[@class="badge comments"]')
      .getText();

    const countEstablishments = await browser
      .$('//a[text()="Establishments"]/ancestor::tr//span[@class="badge comments"]')
      .getText();
    const countPoles = await browser
      .$('//a[text()="Places other than a licensed establishment (POLEs)"]/ancestor::tr//span[@class="badge comments"]')
      .getText();
    const countProtocols = await browser
      .$('//a[text()="Protocols"]/ancestor::tr//span[@class="badge comments"]')
      .getText();

    assert.equal(await countIntro, '1 NEW COMMENT');
    assert.equal(await countEstablishments, '2 NEW COMMENTS');
    assert.equal(await countPoles, '4 NEW COMMENTS');
    assert.equal(await countProtocols, '5 NEW COMMENTS');

    await browser.$('a=Protocols').click();

    const protocol1Count = await browser.$$('section.protocol')[0].$('span.badge.comments').getText();
    const protocol2Count = await browser.$$('section.protocol')[1].$('span.badge.comments').getText();

    assert.equal(await protocol1Count, '3 NEW COMMENTS');
    assert.equal(await protocol2Count, '2 NEW COMMENTS');
  });
});
