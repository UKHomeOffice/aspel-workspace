import assert from 'assert';
import moment from 'moment';

import { gotoProjectLandingPage } from '../../helpers/project.js';

const setDatePicker = async(browser, name, date) => {
  const value = moment(date, 'YYYY-MM-DD');
  await browser.waitUntil(async () => {
    await browser.$(`#${name}`).click();
    return browser.$('.bpk-popover').isDisplayed();
  });
  await browser
    .$('.bpk-popover select[name="months"]')
    .selectByVisibleText(value.format('MMMM YYYY'));
  await browser
    .$(
      `.bpk-popover .bpk-calendar-grid[aria-hidden="false"] button[aria-label="${value.format('D MMMM YYYY')}"]`
    )
    .click();
};

describe('Project Deadline Exemptions', () => {
  it('ASRU support can see a list of project applications that passed their statutory deadlines', async() => {
    await browser.withUser('asrusupport');
    await browser.$('a=Performance metrics').click();

    await setDatePicker(browser, 'start', '2020-01-01');
    await setDatePicker(browser, 'end', moment().format('YYYY-MM-DD'));
    await browser.$('button=Update').click();
    assert.equal(
      await browser.$('.metric.statutory-deadlines p').getText(),
      '4',
      'Metrics page should show 4 deadlines passed'
    );

    await browser.$('a=View more data on tasks with missed deadlines').click();
    await browser.$('a=mark statutory deadlines as not missed').click();

    assert.ok(await browser.$('h1=Statutory deadlines passed').isDisplayed(), '');
    assert.strictEqual(
      await browser.$('.metric.passed p').getText(),
      '4',
      'There should be 4 deadlines passed'
    );
    assert.strictEqual(
      await browser.$('.metric.missed p').getText(),
      '4',
      'There should be 4 deadlines missed'
    );
    assert.strictEqual(
      await browser.$('.metric.not-missed p').getText(),
      '0',
      'There should be 0 deadlines not missed'
    );

    const rows = await browser.$$('.govuk-react-datatable tbody tr');
    assert.strictEqual(
      rows.length,
      4,
      'There should be 4 passed deadlines listed'
    );
    assert.ok(
      await browser.$('a=Testing deadline passed').isDisplayed(),
      'There should be a link to the project'
    );
    assert.strictEqual(
      await browser.$('td.isExempt label.badge').getText(),
      'MISSED',
      'There should be a badge explaining the deadline was missed'
    );
  });

  it('Inspectors must provide a reason for the deadline passing', async() => {
    await browser.withUser('inspector');
    await gotoProjectLandingPage(browser, 'Testing deadline passed', 'Draft');

    await browser.$('a=PPL application').click();
    await browser.$('label=Grant licence').click();
    await browser.$('button=Continue').click();

    await browser.completeHba();

    assert.strictEqual(
      await browser.$('h1').getText(),
      'Confirm reason for statutory deadline passing',
      'A page to capture a passed deadline reason should be displayed'
    );
    await browser
      .$('textarea[name=deadline-passed-reason]')
      .setValue('2020 happened');
    await browser.$('button=Continue').click();
    await browser.$('textarea[name=comment]').setValue('This is ready to go');
    await browser.$('button=Grant licence').click();

    await browser.waitForSuccess();
    assert.strictEqual(
      await browser.$('h1.govuk-panel__title').getText(),
      'Approved'
    );
  });

  it('ASRU support can exempt a deadline from counting as passed', async() => {
    await browser.withUser('asrusupport');
    await browser.$('a=Performance metrics').click();
    await browser.$('a=View more data on tasks with missed deadlines').click();
    await browser.$('a=mark statutory deadlines as not missed').click();

    assert.strictEqual(
      await browser.$('.metric.missed p').getText(),
      '4',
      'There should be 4 deadlines missed'
    );
    assert.strictEqual(
      await browser.$('.metric.not-missed p').getText(),
      '0',
      'There should be 0 deadlines not missed'
    );
    assert.strictEqual(
      await browser.$('td.isExempt label.badge').getText(),
      'MISSED',
      'There should be a badge explaining the deadline was missed'
    );

    await browser.$('//a[normalize-space(text())="Testing deadline passed"]/ancestor::tr/td[@class="deadlinePassedDate"]').click();
    await browser.$('//*[contains(@class, "reason")]//p[text()="2020 happened"]')
      .waitForDisplayed({timeoutMsg: "The inspector's reason should be displayed"});

    await browser
      .$('tr.expanded-content')
      .$('a=Change deadline status to not missed')
      .click();
    await browser
      .$('textarea[name=comment]')
      .setValue(
        'The inspector was faced with 2020 and should have had more time'
      );
    await browser.$('button=Change deadline status to not missed').click();

    assert.strictEqual(
      await browser.$('.metric.missed p').getText(),
      '3',
      'There should be 3 deadlines missed'
    );
    assert.strictEqual(
      await browser.$('.metric.not-missed p').getText(),
      '1',
      'There should be 1 deadlines not missed'
    );
    assert.strictEqual(
      await browser.$('//a[normalize-space(text())="Testing deadline passed"]/ancestor::tr/td[@class="isExempt"]/label').getText(),
      'NOT MISSED',
      'There should be a badge explaining the deadline was not missed'
    );

    await browser.$('a=Performance metrics').click();

    await setDatePicker(browser, 'start', '2020-01-01');
    await setDatePicker(browser, 'end', moment().format('YYYY-MM-DD'));
    await browser.$('button=Update').click();

    assert.equal(
      await browser.$('.metric.statutory-deadlines p').getText(),
      '3',
      'Metrics page should show 3 deadlines passed'
    );
  });

  it('ASRU support can change their mind about an exemption', async() => {
    await browser.withUser('asrusupport');
    await browser.$('a=Performance metrics').click();
    await browser.$('a=View more data on tasks with missed deadlines').click();
    await browser.$('a=mark statutory deadlines as not missed').click();

    assert.strictEqual(
      await browser.$('.metric.missed p').getText(),
      '3',
      'There should be 3 deadlines missed'
    );
    assert.strictEqual(
      await browser.$('.metric.not-missed p').getText(),
      '1',
      'There should be 1 deadline not missed'
    );
    assert.strictEqual(
      await browser.$('//a[normalize-space(text())="Testing deadline passed"]/ancestor::tr/td[@class="isExempt"]/label').getText(),
      'NOT MISSED',
      'There should be a badge explaining the deadline was not missed'
    );

    await browser.$('//a[normalize-space(text())="Testing deadline passed"]/ancestor::tr/td[@class="deadlinePassedDate"]').click();
    await browser.$('tr.expanded-content').waitForExist();
    assert.ok(
      await browser.$$('.reason')[0].$('p=2020 happened').isDisplayed(),
      "The inspector's reason should be displayed"
    );
    assert.ok(
      await browser
        .$$('.reason')[1]
        .$('p=The inspector was faced with 2020 and should have had more time')
        .isDisplayed(),
      'The reason for previously exempting the deadline should be displayed'
    );

    await browser
      .$('tr.expanded-content')
      .$('a=Change deadline status to missed')
      .click();
    await browser
      .$('textarea[name=comment]')
      .setValue('Actually, that is not a valid reason');
    await browser.$('button=Change deadline status to missed').click();

    assert.strictEqual(
      await browser.$('.metric.missed p').getText(),
      '4',
      'There should be 4 deadline missed'
    );
    assert.strictEqual(
      await browser.$('.metric.not-missed p').getText(),
      '0',
      'There should be 0 deadlines not missed'
    );
    assert.strictEqual(
      await browser.$('//a[normalize-space(text())="Testing deadline passed"]/ancestor::tr/td[@class="isExempt"]/label').getText(),
      'MISSED',
      'There should be a badge explaining the deadline was missed'
    );
  });
});
