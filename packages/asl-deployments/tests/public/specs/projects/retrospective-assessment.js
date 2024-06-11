import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';
import { findTask } from '../../../helpers/task.js';
import { completeRA } from '../../../helpers/retrospective-assessment.js';

const RA_TRUE = 'The Secretary of State has determined that a retrospective assessment of this licence is required, and should be submitted within 6 months of the licence\'s revocation date.';
const RA_FALSE = 'The Secretary of State has determined that a retrospective assessment of this licence is not required.';

describe('Retrospective Assessment', () => {

  const Tests = {
    isRequiredGranted() {
      it('is required on the granted licence', async() => {
        assert.ok(await browser.$(`p=${RA_TRUE}`).isDisplayed(), 'RA required text should be displayed');
        assert.ok(!await browser.$(`p=${RA_FALSE}`).isDisplayed(), 'RA not required text should not be displayed');
      });
    },
    notRequiredGranted() {
      it('is not required on the granted licence', async() => {
        assert.ok(!await browser.$(`p=${RA_TRUE}`).isDisplayed(), 'RA required text should not be displayed');
        assert.ok(await browser.$(`p=${RA_FALSE}`).isDisplayed(), 'RA not required text should be displayed');
      });
    },
    isRequiredPrinted() {
      it('is required on the printed licence', async() => {
        const pdf = await browser.downloadFile('pdf');
        assert.ok(pdf.includes(RA_TRUE), 'RA required text should be displayed');
        assert.ok(!pdf.includes(RA_FALSE), 'RA not required text not showing');
      });
    },
    notRequiredPrinted() {
      it('is not required on the printed licence', async() => {
        const pdf = await browser.downloadFile('pdf');
        assert.ok(!pdf.includes(RA_TRUE), 'RA required text should not be displayed');
        assert.ok(pdf.includes(RA_FALSE), 'RA not required text showing');
      });
    },
    isRequiredNTS() {
      it('is required on the nts digital view', async() => {
        assert.ok(await browser.$(`p=${RA_TRUE}`).isDisplayed(), 'RA required text should be displayed');
        assert.ok(!await browser.$(`p=${RA_FALSE}`).isDisplayed(), 'RA not required text should not be displayed');
      });
    },
    isRequiredNTSPrinted() {
      it('is required on the nts pdf', async() => {
        const pdf = await browser.downloadFile('nts');
        assert.ok(pdf.includes(RA_TRUE), 'RA required text should be displayed');
        assert.ok(!pdf.includes(RA_FALSE), 'RA not required text not showing');
      });
    },
    notRequiredNTS() {
      it('is not required on the nts digital view', async() => {
        assert.ok(!await browser.$(`p=${RA_TRUE}`).isDisplayed(), 'RA required text should not be displayed');
        assert.ok(await browser.$(`p=${RA_FALSE}`).isDisplayed(), 'RA not required text should be displayed');
      });
    },
    notRequiredNTSPrinted() {
      it('is not required on the nts pdf', async() => {
        const pdf = await browser.downloadFile('nts');
        assert.ok(!pdf.includes(RA_TRUE), 'RA required text should not be displayed');
        assert.ok(pdf.includes(RA_FALSE), 'RA not required text showing');
      });
    }
  };

  before(async() => {
    await browser.withUser('holc');
  });

  function runTests(...args) {
    for (const test of args) {
      Tests[test]();
    }
  }

  describe('RA True', () => {
    describe('Licence', () => {
      before(async () => {
        await gotoProjectLandingPage(browser, 'RA true');
        await browser.$('a=View licence').click();
      });

      runTests(
        'isRequiredGranted',
        'isRequiredPrinted'
      );
    });

    describe('NTS', () => {
      before(async() => {
        await gotoProjectLandingPage(browser, 'RA true');
        await browser.$('a=Non-technical summary').click();
      });

      runTests(
        'isRequiredNTS',
        'isRequiredNTSPrinted'
      );
    });
  });

  describe('RA False', () => {
    describe('Licence', () => {
      before(async() => {
        await gotoProjectLandingPage(browser, 'RA false');
        await browser.$('a=View licence').click();
      });

      runTests(
        'notRequiredGranted',
        'notRequiredPrinted'
      );
    });

    describe('NTS', () => {
      before(async() => {
        await gotoProjectLandingPage(browser, 'RA false');
        await browser.$('a=Non-technical summary').click();
      });

      runTests(
        'notRequiredNTS',
        'notRequiredNTSPrinted'
      );
    });
  });

  describe('RA not editable - species', () => {
    describe('Licence', () => {
      before(async() => {
        await gotoProjectLandingPage(browser, 'RA not editable - species');
        await browser.$('a=View licence').click();
      });

      runTests(
        'isRequiredGranted',
        'isRequiredPrinted'
      );
    });

    describe('NTS', () => {
      before(async() => {
        await gotoProjectLandingPage(browser, 'RA not editable - species');
        await browser.$('a=Non-technical summary').click();
      });

      runTests(
        'isRequiredNTS',
        'isRequiredNTSPrinted'
      );
    });
  });

  describe('Reasons for RA being required', () => {
    it('displays the reason when using cats, dogs or equidae', async() => {
      await gotoProjectLandingPage(browser, 'RA due cats', 'Inactive');
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();
      assert.ok(await browser.$('li=Uses cats, dogs or equidae').isDisplayed(), 'reason cats is displayed');

      await gotoProjectLandingPage(browser, 'RA due cats', 'Inactive');
      await browser.$('a=Non-technical summary').click();
      assert.ok(await browser.$('li=Uses cats, dogs or equidae').isDisplayed(), 'reason cats is displayed in the NTS');

      const pdf = await browser.downloadFile('nts');
      assert.ok(pdf.includes('Reason for retrospective assessment'));
      assert.ok(pdf.includes('Uses cats, dogs or equidae'));
    });

    it('displays the reason when using non-human primates', async() => {
      await gotoProjectLandingPage(browser, 'RA due nhp', 'Inactive');
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();
      assert.ok(await browser.$('li=Uses non-human primates').isDisplayed(), 'reason nhp is displayed');
    });

    it('displays the reason when using endangered animals', async() => {
      await gotoProjectLandingPage(browser, 'RA due endangered', 'Inactive');
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();
      assert.ok(await browser.$('li=Uses endangered animals').isDisplayed(), 'reason endangered is displayed');
    });

    it('displays the reason when using severe procedures', async() => {
      await gotoProjectLandingPage(browser, 'RA due severe procedures', 'Inactive');
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();
      assert.ok(await browser.$('li=Contains severe procedures').isDisplayed(), 'reason severe procedures is displayed');
    });

    it('displays the reason when project is a training licence', async() => {
      await gotoProjectLandingPage(browser, 'RA due training licence', 'Inactive');
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();
      assert.ok(await browser.$('li=Education and training licence').isDisplayed(), 'reason training is displayed');
    });

    it('displays the reason when asru has added RA requirement', async() => {
      await gotoProjectLandingPage(browser, 'RA due asru added', 'Inactive');
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();
      assert.ok(await browser.$('li=Required at inspector’s discretion').isDisplayed(), 'reason asru is displayed');
    });

    it('displays the reason even if only present in a previous version', async() => {
      await gotoProjectLandingPage(browser, 'RA due previous version', 'Inactive');
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();
      assert.ok(await browser.$('li=Uses cats, dogs or equidae').isDisplayed(), 'previous reason is displayed');
    });

    it('displays multiple reasons if present', async() => {
      await gotoProjectLandingPage(browser, 'RA due multiple reasons (dogs, severe)', 'Inactive');
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();
      assert.ok(await browser.$('li=Uses cats, dogs or equidae').isDisplayed(), 'reason dogs is displayed');
      assert.ok(await browser.$('li=Contains severe procedures').isDisplayed(), 'reason severe procedures is displayed');

      await gotoProjectLandingPage(browser, 'RA due multiple reasons (dogs, severe)', 'Inactive');
      await browser.$('a=Non-technical summary').click();
      assert.ok(await browser.$('li=Uses cats, dogs or equidae').isDisplayed(), 'reason dogs is displayed in NTS');
      assert.ok(await browser.$('li=Contains severe procedures').isDisplayed(), 'reason severe procedures is displayed in NTS');
    });
  });

  describe('regression', () => {
    it('can discard an RA submission task and still visit the project landing page successfully', async() => {
      await gotoProjectLandingPage(browser, 'RA due nhp', 'Inactive');
      await browser.$('a=View draft assessment').click();
      await browser.$('button=Continue').click();

      await completeRA(browser);

      await browser.$('button=Continue').click();
      assert.deepStrictEqual(await browser.$('h1').getText(), 'Submit retrospective assessment');

      await browser.$('input[name="ra-awerb-date-day"]').setValue('1');
      await browser.$('input[name="ra-awerb-date-month"]').setValue('1');
      await browser.$('input[name="ra-awerb-date-year"]').setValue('2021');

      await browser.$('textarea#comment').setValue('This is finished');

      await browser.$('button=Endorse and submit now').click();
      assert.ok(await browser.$('h1=Submitted').isDisplayed());

      await browser.$('a=track the progress of this request.').click();
      await browser.$('label=Discard retrospective assessment').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Discard retrospective assessment').click();

      await gotoProjectLandingPage(browser, 'RA due nhp', 'Inactive');
      assert.ok(await browser.$('h2=RA due nhp').isDisplayed(), 'Project title should be visible');
      assert.ok(await browser.$('button=Start assessment').isDisplayed(), 'Should be able to start a fresh RA');
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();
      assert.ok(await browser.$('li=Uses non-human primates').isDisplayed(), 'reason nhp is displayed');
    });
  });

  describe('Collaborators', () => {
    it('cannot start an RA as a basic collaborator', async() => {
      await browser.withUser('collabread');
      await gotoProjectLandingPage(browser, 'RA test collaborator', 'Inactive');
      assert.ok(!await browser.$('button=Start assessment').isDisplayed());
    });

    it('can author an RA as edit collaborator', async() => {
      await browser.withUser('collabedit');
      await gotoProjectLandingPage(browser, 'RA test collaborator', 'Inactive');
      assert.ok(await browser.$('button=Start assessment').isDisplayed());
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();

      await completeRA(browser);

      assert.ok(await browser.$('p=Only the licence holder or an admin can submit this to the Home Office').isDisplayed());
      assert.ok(!await browser.$('button=Continue').isDisplayed());
      await browser.waitForSync();

      await browser.withUser('holc');
      await gotoProjectLandingPage(browser, 'RA test collaborator', 'Inactive');
      await browser.$('a=View draft assessment').click();

      assert.ok(await browser.$('button=Continue').isDisplayed());
      await browser.$('button=Continue').click();

      await browser.$('input[name="ra-awerb-date-day"]').setValue(21);
      await browser.$('input[name="ra-awerb-date-month"]').setValue(12);
      await browser.$('input[name="ra-awerb-date-year"]').setValue(2020);

      await browser.$('button=Endorse and submit now').click();
      assert.ok(await browser.$('h1=Submitted').isDisplayed());
    });
  });

  describe('editable versions', () => {

    it('cannot edit RA once submitted for endorsement', async() => {
      await browser.withUser('basic');
      await gotoProjectLandingPage(browser, 'RA test editable states', 'Inactive');
      await browser.$('a=Reporting').click();
      await browser.$('button=Start assessment').click();
      await browser.$('button=Continue').click();

      await completeRA(browser);

      await browser.$('button=Continue').click();
      await browser.$('button=Submit now').click();

      await browser.waitForSuccess();

      await browser.$('a=track the progress of this request.').click();

      await browser.$('a=View retrospective assessment').click();
      await browser.$('a=Project aims').click();

      const className = await browser.$('#aims-achieved').getAttribute('class');

      assert.ok(className.split(' ').includes('readonly'));
    });

    it('cannot edit previous RA version when it is returned by an admin', async() => {
      await browser.withUser('holc');
      let task = await findTask(browser, '[title="RA test editable states"]');
      await task.$('a=Retrospective assessment').click();

      await browser.$('input[name="status"][value="returned-to-applicant"]').click();
      await browser.$('button=Continue').click();

      await browser.$('textarea[name="comment"]').setValue('returned');
      await browser.$('button=Return with comments').click();

      await browser.waitForSuccess();

      await browser.withUser('basic');

      task = await findTask(browser, '[title="RA test editable states"]');
      await task.$('a=Retrospective assessment').click();

      await browser.$('a=View retrospective assessment').click();
      await browser.$('a=Project aims').click();

      const className = await browser.$('#aims-achieved').getAttribute('class');

      assert.ok(className.split(' ').includes('readonly'));
    });

  });
});
