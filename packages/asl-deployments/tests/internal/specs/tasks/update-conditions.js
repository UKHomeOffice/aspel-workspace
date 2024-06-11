import assert from 'assert';

const continueAndSubmit = async() => {
  await browser.$('button=Continue').click();
  await browser.$('input[name="declaration"][value="true"]').click();
  await browser.$('button=Submit').click();
  await browser.waitForSuccess();
};

const amendAndSubmit = async() => {
  await browser.$('input[value=resolved]').click();
  await browser.$('button[type=submit]').click();
  await browser.$('button').click();
  await browser.$('span=Approved').waitForDisplayed();
  assert.ok(await browser.$('span=Approved').isDisplayed());
};

const findConditions = async(establishment) => {
  await browser.url('/');
  await browser.$('a=Establishments').click();

  await browser.$('input[name="filter-*"]').setValue(establishment);
  await browser.$('button[type=submit][aria-label="Search"]').click();
  await browser.waitForSync();

  await browser.$(`a=${establishment}`).waitForDisplayed();
  await browser.$(`a=${establishment}`).click();

  await browser.$('span=Establishment details').waitForDisplayed();
  await browser.$('span=Establishment details').click();

  await browser.$('span=Conditions').click();
};

const assertCondition = async(establishment, condition, reminder) => {
  await findConditions(establishment);
  assert.ok(await browser.$(`p=${condition}`).isDisplayed(), `condition ${condition} is not displayed`);
  if (reminder) {
    await browser.$('summary=Show when reminders have been scheduled').click();
    assert.ok(await browser.$(`li=${reminder}`).isDisplayed());
  }
};

const findEstablishment = async(establishment) => {
  await browser.withUser('holc');
  await browser.url('/');
  await browser.$(`h3=${establishment}`).click();
  const button = await browser.$(`//a[span/text()="Go to ${establishment}"]`);
  await button.click();
  await browser.$('h1=Establishment overview').waitForExist();
};

const addCondition = async() => {
  await browser.$('a=Add conditions').click();
  await browser.$('textarea[name=conditions]').setValue('New condition');
  await browser.$('//button[span/text()="Save"]').click();
  await browser.waitUntil(() => browser.$('.govuk-inset-text.condition').isDisplayed());
};

const addReminder = async() => {
  await browser.$('a=Update conditions').click();
  await browser.$('input[name=setReminder]').click();
  await browser.$('input[name=deadline-day]').setValue('1');
  await browser.$('input[name=deadline-month]').setValue('1');
  await browser.$('input[name=deadline-year]').setValue('2026');
  await browser.$('//button[span/text()="Save"]').click();
};

const updateCondition = async(condition) => {
  await browser.$('a=Update conditions').click();
  await browser.$('textarea[name=conditions]').setValue(condition);

  await browser.$('input[name=deadline-day]').setValue('2');
  await browser.$('input[name=deadline-month]').setValue('2');
  await browser.$('input[name=deadline-year]').setValue('2027');
  await browser.$('//button[span/text()="Save"]').click();
};

describe('Updating conditions from the task page', () => {

  describe('Establishment amendment', () => {

    beforeEach(async() => {
      await findEstablishment('For establishment update');
      await browser.$('span=Establishment details').click();
      await browser.$('a=Amend licence').click();

      // Changes between the two to keep creating amendments
      if (await browser.$('input[name=country][value=england]:checked').isExisting()) {
        await browser.$('input[name=country][value=scotland]').click();
      } else {
        await browser.$('input[name=country][value=england]').click();
      }

      await browser.$('textarea[name=comments]').setValue('Reason for the change');
      await continueAndSubmit();
    });

    it('can submit an amendment without conditions or reminders added', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For establishment update').$('..').$('span=Establishment amendment').click();
      await amendAndSubmit();
      assert.ok(await browser.$('span=Approved'));
    });

    it('can add a new condition', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For establishment update').$('..').$('span=Establishment amendment').click();

      await addCondition();
      await amendAndSubmit();
      await assertCondition('For establishment update', 'New condition');
    });

    it('can add a reminder to an existing condition', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For establishment update').$('..').$('span=Establishment amendment').click();

      await addReminder();
      await amendAndSubmit();
      await assertCondition('For establishment update', 'New condition', '01/01/2026');
    });

    it('can update an existing condition and reminder', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For establishment update').$('..').$('span=Establishment amendment').click();

      await updateCondition('Updated condition');
      await amendAndSubmit();
      await assertCondition('For establishment update', 'Updated condition', '02/02/2027');
    });

    it('can delete a reminder', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For establishment update').$('..').$('span=Establishment amendment').click();

      await browser.$('a=Update conditions').click();
      await browser.$('input[name=setReminder]').click();
      await browser.$('//button[span/text()="Save"]').click();
      await amendAndSubmit();

      await findConditions('For establishment update');
      assert.ok(!await browser.$('em=Automated reminders have been set for this condition').isDisplayed());
    });

    it('temporary condition persists when the amendment is returned to applicant', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For establishment update').$('..').$('span=Establishment amendment').click();
      await browser.$('a=Update conditions').click();
      await browser.$('textarea[name=conditions]').setValue('Updated condition 2');
      await browser.$('//button[span/text()="Save"]').click();

      await browser.$('input[value=returned-to-applicant]').click();
      await browser.$('button[type=submit]').click();
      await browser.$('textarea[id=comment]').setValue('Return reason');

      await browser.$('span=Return amendment with comments').click();
      await browser.$('button').click();

      // Assert that condition hasn't changed in the licence, only within the task
      await findEstablishment('For establishment update');
      await browser.$('span=Establishment details').click();
      await browser.$('span=Conditions').click();
      assert.ok(await browser.$('p=Updated condition').isDisplayed());

      // Go to the task and assert the condition has been updated
      await browser.url('/');
      await browser.$('td=For establishment update').$('..').$('span=Establishment amendment').click();
      assert.ok(await browser.$('p=Updated condition 2').isDisplayed());
      await browser.$('input[value=discarded-by-applicant]').click();
      await browser.$('button[type=submit]').click();
      await browser.$('span=Discard amendment').click();
    });

  });

  describe('Approved Area amendment', () => {

    beforeEach(async() => {
      await findEstablishment('For area update');
      await browser.$('span=Approved areas').click();
      await browser.$('a=101').click();
      await browser.$('//a[span/text()="Amend area"]').click();

      // If small animals are enabled they will be disabled and vice versa
      await browser.$('input[value=SA]').click();

      await browser.$('textarea[name=comments]').setValue('Reason for the change');
      await continueAndSubmit();
    });

    it('can submit an amendment without conditions or reminders added', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For area update').$('..').$('span=Area amendment').click();
      await amendAndSubmit();
      assert.ok(await browser.$('span=Approved'));
    });

    it('can add a new condition', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For area update').$('..').$('span=Area amendment').click();

      await addCondition();
      await amendAndSubmit();
      await assertCondition('For area update', 'New condition');
    });

    it('can add a reminder to an existing condition', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For area update').$('..').$('span=Area amendment').click();

      await addReminder();
      await amendAndSubmit();
      await assertCondition('For area update', 'New condition', '01/01/2026');
    });

    it('can update an existing condition and reminder', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For area update').$('..').$('span=Area amendment').click();

      await updateCondition('Updated condition');
      await amendAndSubmit();
      await assertCondition('For area update', 'Updated condition', '02/02/2027');
    });

    it('can delete a reminder', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For area update').$('..').$('span=Area amendment').click();

      await browser.$('a=Update conditions').click();
      await browser.$('input[name=setReminder]').click();
      await browser.$('//button[span/text()="Save"]').click();
      await amendAndSubmit();

      await findConditions('For area update');
      assert.ok(!await browser.$('em=Automated reminders have been set for this condition').isDisplayed());
    });

    it('temporary condition persists when the amendment is returned to applicant', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For area update').$('..').$('span=Area amendment').click();
      await browser.$('a=Update conditions').click();
      await browser.$('textarea[name=conditions]').setValue('Updated condition 2');
      await browser.$('//button[span/text()="Save"]').click();

      await browser.$('input[value=returned-to-applicant]').click();
      await browser.$('button[type=submit]').click();
      await browser.$('textarea[id=comment]').setValue('Return reason');
      await browser.$('span=Return amendment with comments').click();
      await browser.$('button').click();

      // Assert that condition hasn't changed in the licence, only within the task
      await findEstablishment('For area update');
      await browser.$('span=Establishment details').click();
      await browser.$('span=Conditions').click();
      assert.ok(await browser.$('p=Updated condition').isDisplayed());

      // Go to the task and assert the condition has been updated
      await browser.url('/');
      await browser.$('td=For area update').$('..').$('span=Area amendment').click();
      assert.ok(await browser.$('p=Updated condition 2').isDisplayed());
      await browser.$('input[value=discarded-by-applicant]').click();
      await browser.$('button[type=submit]').click();
      await browser.$('span=Discard amendment').click();
    });

  });

  describe('Named person amendment', () => {

    beforeEach(async() => {
      await findEstablishment('For person update');
      await browser.$('span=People').click();
      await browser.$('a=Neil Down').click();

      if (!await browser.$('span=Remove role').isDisplayed()) {
        // if no role add a role
        await browser.$('//a[span/text()="Add role"]').click();
        await browser.$('input[value=ntco]').click();
        await browser.$('textarea[name=comment]').setValue('Reason for the change');
        await continueAndSubmit();
      } else {
        // if role exists remove the role
        await browser.$('span=Remove role').click();
        await browser.$('textarea[name=comment]').setValue('Reason for the change');
        await continueAndSubmit();
      }
    });

    it('can submit an amendment without conditions or reminders added', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For person update').$('..').$('span=Add named person (NTCO)').click();
      await amendAndSubmit();
      assert.ok(await browser.$('span=Approved'));
    });

    it('can add a new condition', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For person update').$('..').$('span=Remove named person (NTCO)').click();

      await addCondition();
      await amendAndSubmit();
      await assertCondition('For person update', 'New condition');
    });

    it('can add a reminder to an existing condition', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For person update').$('..').$('span=Add named person (NTCO)').click();

      await addReminder();
      await amendAndSubmit();
      await assertCondition('For person update', 'New condition', '01/01/2026');
    });

    it('can update an existing condition and reminder', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For person update').$('..').$('span=Remove named person (NTCO)').click();

      await updateCondition('Updated condition');
      await amendAndSubmit();
      await assertCondition('For person update', 'Updated condition', '02/02/2027');
    });

    it('can delete a reminder', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For person update').$('..').$('span=Add named person (NTCO)').click();

      await browser.$('a=Update conditions').click();
      await browser.$('input[name=setReminder]').click();
      await browser.$('//button[span/text()="Save"]').click();
      await amendAndSubmit();

      await findConditions('For person update');
      assert.ok(!await browser.$('em=Automated reminders have been set for this condition').isDisplayed());
    });

    it('temporary condition persists when the amendment is returned to applicant', async() => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$('td=For person update').$('..').$('span=Remove named person (NTCO)').click();
      await browser.$('a=Update conditions').click();
      await browser.$('textarea[name=conditions]').setValue('Updated condition 2');
      await browser.$('//button[span/text()="Save"]').click();

      await browser.$('input[value=returned-to-applicant]').click();
      await browser.$('button[type=submit]').click();
      await browser.$('textarea[id=comment]').setValue('Return reason');
      await browser.$('span=Return amendment with comments').click();
      await browser.$('button').click();

      // Assert that condition hasn't changed in the licence, only within the task
      await findEstablishment('For person update');
      await browser.$('span=Establishment details').click();
      await browser.$('span=Conditions').click();
      assert.ok(await browser.$('p=Updated condition').isDisplayed());

      // Go to the task and assert the condition has been updated
      await browser.url('/');
      await browser.$('td=For person update').$('..').$('span=Remove named person (NTCO)').click();
      assert.ok(await browser.$('p=Updated condition 2').isDisplayed());
      await browser.$('input[value=discarded-by-applicant]').click();
      await browser.$('button[type=submit]').click();
      await browser.$('span=Discard amendment').click();
    });

  });

});
