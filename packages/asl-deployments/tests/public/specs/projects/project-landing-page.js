import assert from 'assert';
import { gotoProjectLandingPage, gotoOverviewTab, gotoManageTab, completeAwerb } from '../../helpers/project.js';

const Helpers = {
  async canChangeLicenceHolder(browser) {
    await gotoManageTab(browser);
    // granted vs draft: link can be "Change licence holder" or "change licence holder only" - note the case
    assert.ok(await browser.$('a*=hange licence holder').isDisplayed(), 'Can change licence holder');
  },
  async cannotChangeLicenceHolder(browser) {
    await gotoManageTab(browser);
    assert.ok(!await browser.$('a*=hange licence holder').isDisplayed(), 'Cannot change licence holder');
  },
  async canEditDraft(browser) {
    await gotoOverviewTab(browser);
    assert.ok(await browser.$('a=Open application').isDisplayed(), 'Can edit draft');
  },
  async draftLinksToEditView(browser) {
    await gotoOverviewTab(browser);
    assert.ok(await browser.$('a=Open application').isDisplayed());
    const href = await browser.$('a=Open application').getAttribute('href');
    assert.ok(href.match(/\/edit$/), 'Links to the edit view');
  },
  async canContinueEditingDraft(browser) {
    await gotoOverviewTab(browser);
    assert.ok(await browser.$('a=Continue editing draft').isDisplayed(), 'Can continue editing draft');
  },
  async continueEditingLinksToEditView(browser) {
    await gotoOverviewTab(browser);
    assert.ok(await browser.$('a=Continue editing draft').isDisplayed());
    const href = await browser.$('a=Continue editing draft').getAttribute('href');
    assert.ok(href.match(/\/edit$/), 'links to the edit view');
  },
  async canViewSubmittedDraft(browser) {
    await gotoOverviewTab(browser);
    assert.ok(await browser.$('a=View submitted draft').isDisplayed(), 'Can view submitted draft');
  },
  async submittedDraftLinksToReadonly(browser) {
    await gotoOverviewTab(browser);
    assert.ok(await browser.$('a=View submitted draft').isDisplayed());
    const href = await browser.$('a=View submitted draft').getAttribute('href');
    assert.ok(!href.match(/\/edit$/), 'Links to the read only view');
  },
  async canDiscardDraft(browser) {
    await gotoManageTab(browser);
    assert.ok(await browser.$('button=Discard application').isDisplayed(), 'Can discard draft');
  },
  async cannotDiscardDraft(browser) {
    await gotoManageTab(browser);
    assert.ok(!await browser.$('button=Discard application').isDisplayed(), 'Cannot discard draft');
  },
  async noOpenTask(browser) {
    await gotoManageTab(browser);
    assert.ok(!await browser.$('a=View task').isDisplayed(), 'No open task');
  },
  async canViewTask(browser) {
    await gotoManageTab(browser);
    assert.ok(await browser.$('a=View task').isDisplayed(), 'Can view task');
  },
  async canViewGrantedLicence(browser) {
    await gotoOverviewTab(browser);
    assert.ok(await browser.$('a=View licence').isDisplayed(), 'Can view granted licence');
  },
  async grantedLicenceLinksToReadonly(browser) {
    await gotoOverviewTab(browser);
    assert.ok(await browser.$('a=View licence').isDisplayed());
    const href = await browser.$('a=View licence').getAttribute('href');
    assert.ok(!href.match(/\/edit$/), 'links to the readonly view');
  },
  async canStartAmendment(browser) {
    await gotoManageTab(browser);
    assert.ok(await browser.$('button=Amend licence').isDisplayed(), 'Can start amendment');
  },
  async cannotStartAmendment(browser) {
    await gotoManageTab(browser);
    assert.ok(!await browser.$('button=Amend licence').isDisplayed(), 'Cannot start amendment');
  },
  async canRequestRevocation(browser) {
    await gotoManageTab(browser);
    assert.ok(await browser.$('a=Revoke licence').isDisplayed(), 'Can request revocation');
  },
  async cannotRequestRevocation(browser) {
    await gotoManageTab(browser);
    assert.ok(!await browser.$('a=Revoke licence').isDisplayed(), 'Cannot request revocation');
  },
  async canEditAmendment(browser) {
    await gotoManageTab(browser);
    assert.ok(await browser.$('button=Edit amendment').isDisplayed(), 'Can edit amendment');
  },
  // TODO: This will eventually discard the task and amendment directly
  async canViewTaskToDiscard(browser) {
    await gotoManageTab(browser);
    assert.ok(await browser.$('a=View task to discard').isDisplayed(), 'Can view task to discard');
  },
  async hasAsruAmendmentInProgressMessage(browser) {
    await gotoManageTab(browser);
    assert(await browser.$('h2*=Amendment in progress').isDisplayed(), 'has ASRU amendment in progress warning heading');
    assert(await browser.$('p*=The Home Office has initiated an amendment to this project').isDisplayed(), 'has ASRU amendment in progress warning text');
  },
  async hasUnsubmittedAsruAmendmentInProgressMessage(browser) {
    await gotoOverviewTab(browser);
    assert(await browser.$('h3=Amendment in progress').isDisplayed(), 'has ASRU amendment in progress warning heading');
    assert(await browser.$('p*=The Home Office has initiated an amendment to this project').isDisplayed(), 'has ASRU amendment in progress warning text');
  },
  async hasActionableAmendmentInProgressMessageOnOverview(browser) {
    await gotoOverviewTab(browser);
    assert.ok(await browser.$('section.current-activity').$('h3=Amendment in progress').isDisplayed());
    assert.ok(await browser.$('section.current-activity').$('a=Edit amendment').isDisplayed());
  }
};

async function runAssertions(browser, assertions) {
  for (const a of assertions) {
    await Helpers[a](browser);
  }
}

describe('Project landing page', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  beforeEach(async() => {
    await browser.url('/');
  });

  describe('Application', () => {
    beforeEach(async() => {
      await gotoProjectLandingPage(browser, 'New draft', 'Drafts');
    });

    describe('New draft', () => {
      it('can continue editing, change licence holder or discard', async() => {
        await runAssertions(browser, [
          'canChangeLicenceHolder',
          'canEditDraft',
          'draftLinksToEditView',
          'canDiscardDraft',
          'noOpenTask'
        ]);
      });
    });

    describe('Submitted', () => {
      before(async() => {
        await gotoOverviewTab(browser);
        await browser.$('a=Open application').click();
        await browser.$('button=Continue').click();
        await completeAwerb(browser, true);
        await browser.$('button=Submit PPL application to Home Office').click();

        assert.equal(await browser.$('.page-header h1').getText(), 'Project application');
        assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
      });

      it('cannot edit as with ASRU', async() => {
        await runAssertions(browser, [
          'cannotChangeLicenceHolder',
          'canViewSubmittedDraft',
          'submittedDraftLinksToReadonly',
          'cannotDiscardDraft',
          'canViewTask'
        ]);
      });

      it('can continue editing once recalled', async() => {
        await gotoManageTab(browser);
        await browser.$('a=View task').click();
        await browser.$('label=Recall application').click();
        await browser.$('button=Continue').click();
        await browser.$('button=Recall application').click();

        assert.equal(await browser.$('.page-header h1').getText(), 'Project application');
        assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');

        await gotoProjectLandingPage(browser, 'New draft', 'Drafts');

        await runAssertions(browser, [
          'canChangeLicenceHolder',
          'canContinueEditingDraft',
          'continueEditingLinksToEditView',
          'canViewTask'
        ]);
      });
    });
  });

  describe('Amendment', () => {
    beforeEach(async() => {
      await gotoProjectLandingPage(browser, 'Active project');
    });

    describe('Active licence', () => {

      it('can see issue date - regression', async() => {
        assert.ok(await browser.$('dt=Date granted').isDisplayed());
        assert.ok(await browser.$('dd=23 April 2023').isDisplayed());
      });

      it('can start a new amendment, amend licence holder, view granted, or revoke', async() => {
        await runAssertions(browser, [
          'canChangeLicenceHolder',
          'canViewGrantedLicence',
          'grantedLicenceLinksToReadonly',
          'canStartAmendment',
          'canRequestRevocation',
          'noOpenTask'
        ]);
      });

      describe('Submitted change to licence holder', () => {
        before(async() => {
          await gotoManageTab(browser);
          await browser.$('a*=hange licence holder').click();
          await browser.browserAutocomplete('licenceHolderId', 'Dagny Aberkirder');
          await browser.$('button=Continue').click();
          await browser.$('button=Continue').click();
          await browser.$('input[name="awerb-exempt"][value="false"]').click();
          await browser.$('input[name="awerb-8201-day"]').setValue('01');
          await browser.$('input[name="awerb-8201-month"]').setValue('01');
          await browser.$('input[name="awerb-8201-year"]').setValue('2021');
          await browser.$('button=Submit PPL amendment to Home Office').click();

          assert.equal(await browser.$('.page-header h1').getText(), 'Project licence amendment');
          assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
        });

        it('Can view granted licence or view open task', async() => {
          await runAssertions(browser, [
            'cannotChangeLicenceHolder',
            'canViewGrantedLicence',
            'grantedLicenceLinksToReadonly',
            'cannotStartAmendment',
            'cannotRequestRevocation',
            'canViewTask'
          ]);
        });

        // TODO: Edit and resubmit change licence holder will be a thing.
        describe('Amendment recalled', () => {
          before(async() => {
            await gotoManageTab(browser);
            await browser.$('a=View task').click();
            await browser.$('label=Recall amendment').click();
            await browser.$('button=Continue').click();
            await browser.$('button=Recall amendment').click();

            assert.equal(await browser.$('.page-header h1').getText(), 'Project licence amendment');
            assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');
          });

          it('Can view granted licence or view open task if recalled', async() => {
            await runAssertions(browser, [
              'cannotChangeLicenceHolder',
              'canViewGrantedLicence',
              'grantedLicenceLinksToReadonly',
              'cannotStartAmendment',
              'cannotRequestRevocation',
              'canViewTask'
            ]);
          });
        });

        describe('Amendment discarded', () => {
          before(async() => {
            await gotoManageTab(browser);
            await browser.$('a=View task').click();
            await browser.$('label=Discard amendment').click();
            await browser.$('button=Continue').click();
            await browser.$('button=Discard amendment').click();

            assert.equal(await browser.$('.page-header h1').getText(), 'Project licence amendment');
            assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');
          });

          it('Can amend licence holder, start new amendment, view granted licence, or revoke if amendment discarded', async() => {
            await runAssertions(browser, [
              'canChangeLicenceHolder',
              'canViewGrantedLicence',
              'grantedLicenceLinksToReadonly',
              'canStartAmendment',
              'canRequestRevocation',
              'noOpenTask'
            ]);
          });
        });
      });

      describe('New amendment', () => {
        before(async() => {
          await gotoManageTab(browser);
          await browser.$('button=Amend licence').click();
          await gotoProjectLandingPage(browser, 'Active project');
        });

        it('Warns about unsubmitted amendment in progress', async() => {
          await runAssertions(browser, [
            'hasActionableAmendmentInProgressMessageOnOverview'
          ]);
        });

        it('Can submit an amendment', async() => {
          await gotoManageTab(browser);
          await browser.$('button=Edit amendment').click();
          await browser.$('button=Continue').click();
          await completeAwerb(browser, true);
          await browser.$('#comments').setValue('Comments');
          await browser.$('button*=Submit PPL amendment').click();

          assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
          assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
        });

        it('Can view granted licence and view task', async() => {
          await runAssertions(browser, [
            'cannotChangeLicenceHolder',
            'canViewGrantedLicence',
            'grantedLicenceLinksToReadonly',
            'cannotStartAmendment',
            'cannotRequestRevocation',
            'canViewTask'
          ]);
        });

        describe('Recalled', () => {
          before(async() => {
            await gotoManageTab(browser);
            await browser.$('a=View task').click();
            await browser.$('label=Recall amendment').click();
            await browser.$('button=Continue').click();
            await browser.$('button=Recall amendment').click();

            assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
            assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');
          });

          it('can view granted licence, edit amendment, or view task to discard', async() => {
            await runAssertions(browser, [
              'cannotChangeLicenceHolder',
              'canViewGrantedLicence',
              'grantedLicenceLinksToReadonly',
              'canEditAmendment',
              'canViewTaskToDiscard'
            ]);
          });
        });

        describe('Discarded', () => {
          before(async() => {
            await gotoManageTab(browser);
            await browser.$('a=View task to discard').click();
            await browser.$('label=Discard amendment').click();
            await browser.$('button=Continue').click();
            await browser.$('button=Discard amendment').click();

            assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
            assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');
          });

          it('Can update licence holder, view granted, start amendment or request revocation', async() => {
            await runAssertions(browser, [
              'canChangeLicenceHolder',
              'canViewGrantedLicence',
              'grantedLicenceLinksToReadonly',
              'canStartAmendment',
              'canRequestRevocation',
              'noOpenTask'
            ]);
          });
        });
      });

      describe('Revocation', () => {
        before(async() => {
          await gotoManageTab(browser);
          await browser.$('a=Revoke licence').click();
          await browser.$('#comments').setValue('Comments');
          await browser.$('button=Continue').click();
          await browser.$('button=Submit').click();

          assert.equal(await browser.$('.page-header h1').getText(), 'Project revocation');
          assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
        });

        it('Cannot change licence holder, can view granted, can view task', async() => {
          await runAssertions(browser, [
            'cannotChangeLicenceHolder',
            'canViewGrantedLicence',
            'grantedLicenceLinksToReadonly',
            'cannotStartAmendment',
            'cannotRequestRevocation',
            'canViewTask'
          ]);
        });

        describe('Recalled', () => {
          before(async() => {
            await gotoManageTab(browser);
            await browser.$('a=View task').click();
            await browser.$('label=Recall revocation').click();
            await browser.$('button=Continue').click();
            await browser.$('button=Recall revocation').click();

            assert.equal(await browser.$('.page-header h1').getText(), 'Project revocation');
            assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');
          });

          it('Cannot change licence holder, can view granted, can view task', async() => {
            await runAssertions(browser, [
              'cannotChangeLicenceHolder',
              'canViewGrantedLicence',
              'grantedLicenceLinksToReadonly',
              'cannotStartAmendment',
              'cannotRequestRevocation',
              'canViewTask'
            ]);
          });
        });

        describe('Discarded', () => {
          before(async() => {
            await gotoManageTab(browser);
            await browser.$('a=View task').click();
            await browser.$('label=Discard revocation').click();
            await browser.$('button=Continue').click();
            await browser.$('button=Discard revocation').click();

            assert.equal(await browser.$('.page-header h1').getText(), 'Project revocation');
            assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');
          });

          it('Cannot change licence holder, can view granted, can view task', async() => {
            await runAssertions(browser, [
              'canChangeLicenceHolder',
              'canViewGrantedLicence',
              'grantedLicenceLinksToReadonly',
              'canStartAmendment',
              'canRequestRevocation',
              'noOpenTask'
            ]);
          });
        });
      });
    });
  });

  describe('Expired licence', () => {
    beforeEach(async() => {
      await gotoProjectLandingPage(browser, 'Expired project', 'Expired');
    });

    it('Can view expired licence', async() => {
      await runAssertions(browser, [
        'cannotChangeLicenceHolder',
        'cannotStartAmendment',
        'cannotRequestRevocation',
        'noOpenTask'
      ]);

      await gotoOverviewTab(browser);
      assert.ok(await browser.$('a=View licence').isDisplayed(), 'Can view expired licence');
      const href = await browser.$('a=View licence').getAttribute('href');
      assert.ok(!href.match(/\/edit$/), 'links to the readonly view');
    });
  });

  describe('Revoked licence', () => {
    beforeEach(async() => {
      await gotoProjectLandingPage(browser, 'Revoked project', 'Revoked');
    });

    it('Can view revoked licence', async() => {
      await runAssertions(browser, [
        'cannotChangeLicenceHolder',
        'cannotStartAmendment',
        'cannotRequestRevocation',
        'noOpenTask'
      ]);

      await gotoOverviewTab(browser);
      assert.ok(await browser.$('a=View licence').isDisplayed(), 'Can view revoked licence');
      const href = await browser.$('a=View licence').getAttribute('href');
      assert.ok(!href.match(/\/edit$/), 'links to the readonly view');
    });
  });

  describe('ASRU amendments', () => {
    it('Cannot amend own licence while there is an ASRU draft amendment in progress', async() => {
      await gotoProjectLandingPage(browser, 'ASRU amendment in progress: draft');
      await runAssertions(browser, [
        'cannotStartAmendment',
        'hasUnsubmittedAsruAmendmentInProgressMessage',
        'hasAsruAmendmentInProgressMessage'
      ]);
    });

    it('Cannot amend own licence while there is an ASRU submitted amendment in progress', async() => {
      await gotoProjectLandingPage(browser, 'ASRU amendment in progress: submitted');
      await runAssertions(browser, [
        'cannotStartAmendment',
        'hasAsruAmendmentInProgressMessage'
      ]);
    });
  });

  describe('Amendment in progress', () => {

    // regression test for related task permissions bug
    it('a read-only user can view a project with an amendment in progress', async() => {
      await browser.withUser('read');
      await gotoProjectLandingPage(browser, 'Amend in prog project');
      assert.ok(await browser.$('.document-header').$('h2=Amend in prog project').isDisplayed());
      assert.ok(!await browser.$('h2=Current activity').isDisplayed());
    });

  });

});
