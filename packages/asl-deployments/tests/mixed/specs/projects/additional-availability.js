import assert from 'assert';
import {
  gotoProjectLandingPage,
  gotoProjectManagementPage,
  gotoProjectList,
  completeAwerb
} from '../../../public/helpers/project.js';
import { gotoProfile } from '../../../public/helpers/profile.js';

const submitAmendment = async (browser, title) => {
  await browser.waitForSync();
  await browser.$('button=Continue').click();
  await browser.$('textarea[name="comment"]').setValue('some comments');
  await browser.$('textarea[name="comments"]').setValue('some comments');
  await browser.$('button*=Submit PPL amendment').click();

  await browser.withUser('holc');
  await browser.$(`[title="${title}"]`).$('a=PPL amendment').click();
  await browser.$('label=Endorse amendment').click();
  await browser.$('button=Continue').click();
  await completeAwerb(browser);
  await browser.$('button=Endorse amendment').click();
};

describe('Additional availability', () => {
  describe('Granted licence', () => {
    const title = 'Additional availability to be added';

    it('can add additional establishments', async () => {
      await browser.withUser('additionalavailability');
      await gotoProjectManagementPage(browser, title);
      await browser.$('button=Amend licence').click();
      await browser.$('a=Establishments').click();
      await browser.$('input[name="other-establishments"][value="true"]').click();
      await browser.$('button=Continue').click();
      await browser.$('label=Marvell Pharmaceutical').click();
      await browser.$('button=Add another additional establishment').click();

      const secondEst = await browser.$$('.panel')[1];
      assert.ok(
        !(await secondEst.$('label=Marvell Pharmaceutical').isDisplayed()),
        'Same est should not appear if added'
      );

      await secondEst.$('label=Big Pharma').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      await browser.$('a=Transfer and movement of animals').click();
      await browser.$('button=Continue').click();
      await browser.$('label=This section is complete').click();
      await browser.$('button=Continue').click();
      await submitAmendment(browser, title);

      await gotoProjectList(browser, 'University of Croydon');
      await browser.$('.search-box input[type="text"]').setValue(title);
      await browser.$('.search-box button').click();
      await browser.$('table:not(.loading)').waitForExist();
      const titleCell = await browser.$(`td*=${title}`);
      const _text = await titleCell.getText();
      assert.ok(!_text.includes('Additional availability at'), 'draft AA should not be visible in active project list');

      await browser.withUser('pharmaadmin');
      await gotoProjectList(browser, 'Marvell Pharmaceutical');
      assert.ok(!(await browser.$(`=${title}`).isDisplayed()), 'Expected project to not be visible yet');

      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$(`[title="${title}"]`).$('a=PPL amendment').click();

      const additionalAvailabilityContainer = await browser.$('#submitted-version');

      assert.ok(
        await additionalAvailabilityContainer.$('a=Marvell Pharmaceutical').isDisplayed(),
        'Expected link to additional est'
      );
      assert.ok(
        await additionalAvailabilityContainer.$('a=Big Pharma').isDisplayed(),
        'Expected link to additional est'
      );

      await browser.$('label=Amend licence').click();
      await browser.$('button=Continue').click();

      await browser.completeHba();

      await browser.$('button=Amend licence').click();

      await browser.withUser('pharmaadmin');
      await gotoProjectList(browser, 'Marvell Pharmaceutical');

      assert.ok(await browser.$(`a=${title}`).isDisplayed(), 'Expected link to additional availability project');
      assert.ok(
        await browser.$('li=Primary availability at University of Croydon').isDisplayed(),
        'Expected licence holding est to show in project list'
      );
      await browser.$(`a=${title}`).click();

      assert.equal(await browser.$('.document-header h2').getText(), title);
      assert.ok(
        await browser.$('=Marvell Pharmaceutical').isDisplayed(),
        'Additional availability establishment should be shown'
      );

      await browser.$('a=View licence').click();

      const additionalEsts = await browser.$('h3=Additional establishments').$('..');

      assert.ok(await additionalEsts.$('li=Marvell Pharmaceutical').isDisplayed());
      assert.ok(await additionalEsts.$('li=Big Pharma').isDisplayed());

      await browser.withUser('additionalavailability');
      await gotoProjectList(browser);
      assert.ok(
        await browser.$('li=Additional availability at Big Pharma and Marvell Pharmaceutical').isDisplayed(),
        'Expected AA to show in proj list'
      );

      await gotoProjectLandingPage(browser, title, 'Active', 'Marvell Pharmaceutical');
      assert.ok(
        !(await browser.$('a=Change').isDisplayed()),
        'Change licence holder link should not be displayed when viewing from aa est'
      );
    });

    it('displays additional availability on projects when viewing the profile at the primary establishment', async () => {
      await browser.withUser('additionalavailability');
      await gotoProfile(browser, 'AA User', 'University of Croydon');

      const projectDetails = await browser.$(`a=${title}`).closest('.project');
      assert.ok(
        !(await projectDetails.$('li=Primary availability at University of Croydon').isDisplayed()),
        'The project does not display its primary availability on a profile viewed at the primary establishment'
      );
      assert.ok(
        await projectDetails
          .$('//li[contains(.,"Additional availability at Big Pharma, Marvell Pharmaceutical")]')
          .isDisplayed(),
        'The project displays its additional availability on a profile viewed at the primary establishment'
      );
    });

    it('displays primary and additional availability on projects when viewing the profile at additional establishment(s)', async () => {
      await browser.withUser('additionalavailability');
      await gotoProfile(browser, 'AA User', 'Marvell Pharmaceutical');

      await browser.$(`a=${title}`).waitForDisplayed();
      let projectDetails = await browser.$(`a=${title}`).closest('.project');
      assert.ok(
        await projectDetails.$('//li[contains(.,"Primary availability at University of Croydon")]').isDisplayed(),
        'The project displays its primary availability on a profile viewed at an AA establishment'
      );
      assert.ok(
        await projectDetails
          .$('//li[contains(.,"Additional availability at Big Pharma, Marvell Pharmaceutical")]')
          .isDisplayed(),
        'The project displays its additional availability on a profile viewed at an AA establishment'
      );

      await gotoProfile(browser, 'AA User', 'Big Pharma');

      projectDetails = await browser.$(`a=${title}`).closest('.project');
      assert.ok(
        await projectDetails.$('//li[contains(.,"Primary availability at University of Croydon")]').isDisplayed(),
        'The project displays its primary availability on a profile viewed at an AA establishment'
      );
      assert.ok(
        await projectDetails
          .$('//li[contains(.,"Additional availability at Big Pharma, Marvell Pharmaceutical")]')
          .isDisplayed(),
        'The project displays its additional availability on a profile viewed at an AA establishment'
      );
    });

    it('can add collaborators as additional est admin', async () => {
      await browser.withUser('pharmaadmin');
      await gotoProjectManagementPage(browser, title, 'Active', 'Marvell Pharmaceutical');

      assert.ok(await browser.$('a=Grant access').isDisplayed());

      await browser.$('a=Grant access').click();
      await browser.$('input[name="input-autocomplete"]').setValue('Jason');
      await browser.$('li=Jason Alden').click();
      await browser.$('button=Submit').click();

      await browser.withUser('marvellntco');
      await gotoProjectLandingPage(browser, title, 'Active', 'Marvell Pharmaceutical');
      assert.ok(await browser.$('.document-header').$(`h2=${title}`).isDisplayed());

      await browser.$('a=View licence').click();
      assert.equal(await browser.$('.document-header h2').getText(), title);

      await browser.withUser('holc');
      await gotoProjectManagementPage(browser, title);

      assert.ok(!(await browser.$('=Jason Alden').isDisplayed()), 'Collab from other est should not be displayed');

      await browser.$('a=Grant access').click();
      await browser.$('input[name="input-autocomplete"]').setValue('Basic');
      await browser.$('li=Basic User').click();
      await browser.$('button=Submit').click();

      await browser.withUser('pharmaadmin');
      await gotoProjectManagementPage(browser, title, 'Active', 'Marvell Pharmaceutical');

      assert.ok(!(await browser.$('=Basic User').isDisplayed()), 'Collaborator from main est should not be shown');

      await browser.withUser('holc');
      await gotoProjectManagementPage(browser, title);

      await browser.$('button=Remove access').click();
    });

    it('can remove an individual aa establishment and submit it', async () => {
      await browser.withUser('additionalavailability');
      await gotoProjectManagementPage(browser, title);

      await browser.$('button=Amend licence').click();
      await browser.$('a=Establishments').click();
      await browser.$('button=Continue').click();

      let aaEstablishments = await browser.$$('.repeats-establishments>section');
      let [marvellAA, bigPharmaAA] = aaEstablishments;
      assert.strictEqual(await aaEstablishments.length, 2, 'there should be 2 aa sections listed');

      // remove marvell aa
      await marvellAA.$('a=Remove').click();
      aaEstablishments = await browser.$$('.repeats-establishments>section');
      [marvellAA, bigPharmaAA] = aaEstablishments;
      assert.strictEqual(await aaEstablishments.length, 2, 'there should still be 2 aa sections listed');

      let classAttribute = await marvellAA.$('.panel').getAttribute('class');
      assert.ok(await classAttribute.includes('deleted'), 'the removed aa should be styled as deleted');
      assert.ok(
        await marvellAA.$('p=Marvell Pharmaceutical').isDisplayed(),
        'establishment name of removed aa should still be visible'
      );
      assert.ok(await marvellAA.$('.badge.deleted').isDisplayed(), 'the removed aa should have a deleted badge');
      assert.ok(await marvellAA.$('a=Restore').isDisplayed(), 'the removed aa should have a restore link');
      assert.ok(
        await bigPharmaAA.$('h2=Additional establishment 1').isDisplayed(),
        'the numbering should ignore deleted aa'
      );

      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      // review page
      assert.ok(await browser.$('p=University of Croydon').isDisplayed(), 'primary establishment should be visible');
      aaEstablishments = await browser.$$('.repeats-establishments>section');
      [marvellAA, bigPharmaAA] = aaEstablishments;
      classAttribute = await marvellAA.$('.panel').getAttribute('class');
      assert.ok(await classAttribute.includes('deleted'), 'the removed aa should be styled as deleted');
      assert.ok(
        await marvellAA.$('p=Marvell Pharmaceutical').isDisplayed(),
        'establishment name of removed aa should still be visible'
      );
      assert.ok(await marvellAA.$('.badge.deleted').isDisplayed(), 'the removed aa should have a deleted badge');
      assert.ok(
        await bigPharmaAA.$('h2=Additional establishment 1').isDisplayed(),
        'the numbering should ignore deleted aa'
      );
      assert.ok(
        await bigPharmaAA.$('p=Big Pharma').isDisplayed(),
        'establishment name of remaining aa should be visible'
      );

      await browser.$('button=Continue').click();
      await submitAmendment(browser, title);
      await browser.waitForSuccess();
    });

    it('asru can see the which individual aa was removed when reviewing the amendment and comment on it', async () => {
      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$(`[title="${title}"]`).$('a=PPL amendment').click();

      assert.ok(
        await browser.$('#submitted-version').$('li=Big Pharma').isDisplayed(),
        'big pharma should still be displayed on the task as aa'
      );
      assert.ok(
        !(await browser.$('#submitted-version').$('li=Marvell Pharmaceutical').isDisplayed()),
        'marvell should not be displayed on the task as aa'
      );

      await browser.$('a=View latest submission').click();
      assert.ok(
        await browser.$('//a[text()="Establishments"]/ancestor::tr//*[@class="badge changed"]').isDisplayed(),
        'the establishments section should show a changed badge'
      );

      await browser.$('a=Establishments').click();

      assert.ok(await browser.$('p=University of Croydon').isDisplayed(), 'primary establishment should be visible');
      let aaEstablishments = await browser.$$('.repeats-establishments>section');
      let [marvellAA, bigPharmaAA] = aaEstablishments;
      let classAttribute = await marvellAA.$('.panel').getAttribute('class');
      assert.ok(await classAttribute.includes('deleted'), 'the removed aa should be styled as deleted');

      assert.ok(
        await marvellAA.$('p=Marvell Pharmaceutical').isDisplayed(),
        'establishment name of removed aa should still be visible'
      );
      assert.ok(await marvellAA.$('.badge.deleted').isDisplayed(), 'the removed aa should have a deleted badge');
      assert.ok(
        await bigPharmaAA.$('h2=Additional establishment 1').isDisplayed(),
        'the numbering should ignore deleted aa'
      );
      assert.ok(
        await bigPharmaAA.$('p=Big Pharma').isDisplayed(),
        'establishment name of remaining aa should be visible'
      );

      await (await browser.$('p=Marvell Pharmaceutical').closest('.review')).$('button=Add comment').click();
      await browser.$('textarea[name="add-new-comment"]').setValue('Why is this AA removed?');
      await browser.$('button=Save').click();
      await browser.$('.comment.isNew').waitForDisplayed();

      await browser.$('a=View all sections').click();
      await browser.$('a=Continue').click();

      await browser.$('label=Return amendment with comments').click();
      await browser.$('button=Continue').click();

      await browser.$('textarea[name="comment"]').setValue('returning to the user');
      await browser.$('button=Return amendment with comments').click();
      await browser.waitForSuccess();
    });

    it('applicant can see comments left by asru on a removed aa establishment and restore it', async () => {
      await browser.withUser('additionalavailability');
      await browser.$(`[title="${title}"]`).$('a=PPL amendment').click();
      await browser.$('label=Edit and resubmit the amendment').click();
      await browser.$('button=Continue').click();

      assert.ok(
        await browser.$('//a[text()="Establishments"]/ancestor::tr//*[@class="badge comments"]').isDisplayed(),
        'the establishments section should show a comments badge'
      );
      await browser.$('a=Establishments').click();
      await browser.$('button=Continue').click();

      assert.ok(
        await browser.$('.panel.deleted').$('p=Why is this AA removed?'),
        'the deleted aa should contain the inspectors comment'
      );

      // restore marvell aa
      let aaEstablishments = await browser.$$('.repeats-establishments>section');
      let [marvellAA, bigPharmaAA] = aaEstablishments;
      await marvellAA.$('a=Restore').click();
      await browser.waitForSync();
      aaEstablishments = await browser.$$('.repeats-establishments>section'); // reselect to avoid missing / changed dom
      [marvellAA, bigPharmaAA] = aaEstablishments;
      assert.strictEqual(await aaEstablishments.length, 2, 'there should still be 2 aa sections listed');

      const classAttribute = await marvellAA.$('.panel').getAttribute('class');
      assert.ok(!(await classAttribute.includes('deleted')), 'the restored aa should not be styled as deleted');
      assert.ok(await marvellAA.$('.govuk-radios').isDisplayed(), 'establishment selector should be visible again');
      assert.ok(
        !(await marvellAA.$('.badge.deleted').isDisplayed()),
        'the restored aa should not have a deleted badge'
      );
      assert.ok(await marvellAA.$('a=Remove').isDisplayed(), 'the restored aa should have a remove link');
      assert.ok(
        await bigPharmaAA.$('h2=Additional establishment 2').isDisplayed(),
        'the numbering should be restored to list 2 aa'
      );

      await browser.url('/');
      await browser.$(`[title="${title}"]`).$('a=PPL amendment').click();
      await browser.$('label*=Discard').click();
      await browser.$('button=Continue').click();
      await browser.$('button*=Discard').click();
    });

    it('can remove additional availability and added establishment can still view the previous granted version', async () => {
      await browser.withUser('additionalavailability');
      await gotoProjectManagementPage(browser, title);

      await browser.$('button=Amend licence').click();
      await browser.$('a=Establishments').click();

      await browser.$('input[name="other-establishments"][value="false"]').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      await submitAmendment(browser, title);

      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$(`[title="${title}"]`).$('a=PPL amendment').click();

      await browser.$('label=Amend licence').click();
      await browser.$('button=Continue').click();

      await browser.completeHba();

      await browser.$('button=Amend licence').click();

      await browser.withUser('additionalavailability');
      await gotoProjectLandingPage(browser, title);
      // regression
      assert.ok(
        !(await browser.$('=Marvell Pharmaceutical').isDisplayed()),
        'Additional availability establishment should no longer be shown'
      );

      await browser.$('a=View licence').click();

      const latestVersionUrl = await browser.getUrl();

      await browser.withUser('pharmaadmin');
      await browser.url(await latestVersionUrl.replace('8201', '8202'));

      assert.equal(
        await browser.$('h1').getText(),
        'Page not found',
        "Additional est doesn't have access to latest version"
      );

      await browser.url('/');
      await gotoProjectList(browser, 'Marvell Pharmaceutical');

      assert.ok(await browser.$('span=Availability removed').isDisplayed());

      await browser.$(`a=${title}`).click();

      assert.ok(
        !(await browser.$('a=Grant access').isDisplayed()),
        'Collaborators section should no longer be visible'
      );

      await browser.$('a=View last available version of this licence').click();
      assert.ok(
        await browser.$('span=Additional availability removed').isDisplayed(),
        'Status banner should be present'
      );
    });

    // regression
    it('can remove the user from additional availability establishment once the aa has been removed', async () => {
      await browser.withUser('holc');
      await gotoProfile(browser, 'AA User', 'Marvell Pharmaceutical');
      await browser.$('a=Change / remove').click();
      await browser.$('//a[.="Remove"]').click();
      await browser.$('button=I understand, remove now').click();
      await browser.waitForSuccess();

      await browser.$('a=Invite user').click();
      await browser.$('input#firstName').setValue('AA');
      await browser.$('input#lastName').setValue('User');
      await browser.$('input#email').setValue('aa@example.com');
      await browser.$('label=Personal (Basic access)').click();
      await browser.$('button=Send invitation').click();

      await browser.withUser('additionalavailability');
      await browser.$('a=Marvell Pharmaceutical').click();
      await browser.$('button=Accept').click();

      assert.ok(await browser.$('h3=Marvell Pharmaceutical').isDisplayed(), 'expected Marvell panel to appear');
    });
  });

  describe('Draft project', () => {
    const title = 'Additional availability to be added draft';
    it('Can add additional establishments to a draft and it becomes instantly visible', async () => {
      await browser.withUser('additionalavailability');
      await gotoProjectLandingPage(browser, title, 'Drafts');
      await browser.$('a=Open application').click();
      await browser.$('a=Establishments').click();
      await browser.$('input[name="other-establishments"][value="true"]').click();
      await browser.$('button=Continue').click();
      await browser.$('label=Marvell Pharmaceutical').click();
      await browser.waitForSync();

      await browser.withUser('pharmaadmin');
      await gotoProjectList(browser, 'Marvell Pharmaceutical');
      await browser.$('a=Drafts').click();

      assert.ok(
        await browser.$(`a=${title}`).isDisplayed(),
        'Expected project to appear in additional establishment project list'
      );
      await browser.$(`a=${title}`).click();

      await browser.$('a=Open application').click();
      assert.equal(await browser.$('.document-header h2').getText(), title, 'Expected to be able to view draft');

      await browser.$(`a=${title}`).click();

      await browser.$('a[href="#manage"]').click();
      await browser.$('.manage').waitForExist();
      assert.ok(await browser.$('a=Grant access').isDisplayed());

      await browser.$('a=Grant access').click();
      await browser.$('input[name="input-autocomplete"]').setValue('Jason');
      await browser.$('li=Jason Alden').click();
      await browser.$('button=Submit').click();

      await browser.withUser('marvellntco');
      await gotoProjectLandingPage(browser, title, 'Drafts', 'Marvell Pharmaceutical');

      await browser.$('a=Open application').click();

      assert.equal(
        await browser.$('.document-header h2').getText(),
        title,
        'Expected collaborator to have access to draft'
      );
    });

    it('displays additional availability when viewing the profile at the primary establishment', async () => {
      await browser.withUser('additionalavailability');
      await gotoProfile(browser, 'AA User', 'University of Croydon');
      await browser.$('a=Drafts').click();
      const projectDetails = await browser.$(`a=${title}`).closest('.project');
      assert.ok(
        !(await projectDetails.$('//li[contains(.,"Application at University of Croydon")]').isDisplayed()),
        'The application does not display its primary availability on a profile viewed at the primary establishment'
      );
      assert.ok(
        await projectDetails.$('//li[contains(.,"Additional availability at Marvell Pharmaceutical")]').isDisplayed(),
        'The project displays its additional availability on a profile viewed at the primary establishment'
      );
    });

    it('displays primary and additional availability when viewing the profile at additional establishment(s)', async () => {
      await browser.withUser('additionalavailability');
      await gotoProfile(browser, 'AA User', 'Marvell Pharmaceutical');
      await browser.$('a=Drafts').click();
      const projectLink = await browser.$(`a=${title}`);
      const projectDetails = projectLink.$(function () {
        return this.closest('.project');
      });
      assert.ok(
        await projectDetails.$('//li[contains(.,"Application at University of Croydon")]').isDisplayed(),
        'The project displays its primary availability on a profile viewed at an AA establishment'
      );
      assert.ok(
        await projectDetails.$('//li[contains(.,"Additional availability at Marvell Pharmaceutical")]').isDisplayed(),
        'The project displays its additional availability on a profile viewed at an AA establishment'
      );
    });

    it('can remove additional availability and it becomes instantly disabled', async () => {
      await browser.withUser('additionalavailability');
      await gotoProjectLandingPage(browser, title, 'Drafts');
      const projectUrl = await browser.getUrl();

      await browser.$('a=Open application').click();
      await browser.$('a=Establishments').click();
      await browser.$('input[name="other-establishments"][value="false"]').click();
      await browser.waitForSync();

      await browser.withUser('pharmaadmin');
      await gotoProjectList(browser, 'Marvell Pharmaceutical');
      await browser.$('a=Drafts').click();

      assert.ok(!(await browser.$(`a=${title}`).isDisplayed()), 'Expected project to no longer appear in list');
      await browser.url(projectUrl);

      assert.equal(await browser.$('h1').getText(), 'Page not found', 'Expected project to not be visible');

      await browser.withUser('marvellntco');
      await gotoProjectList(browser, 'Marvell Pharmaceutical');
      await browser.$('a=Drafts').click();

      assert.ok(!(await browser.$(`a=${title}`).isDisplayed()), 'Expected project to no longer appear in list');
      await browser.url(projectUrl);

      assert.equal(await browser.$('h1').getText(), 'Page not found', 'Expected project to not be visible');
    });
  });

  describe('with legacy establishments', async () => {
    const title = 'Additional availability old style';

    it('Can create hard data links', async () => {
      await browser.withUser('additionalavailability');
      await gotoProjectManagementPage(browser, title);
      await browser.$('button=Amend licence').click();
      await browser.$('a=Establishments').click();
      await browser.$('button=Continue').click();
      const establishmentContainers = await browser.$$('div.panel');

      assert.ok(
        await establishmentContainers[0].$('.review').$('p=Marv Pharm').isDisplayed(),
        'Expected free text establishment to be played back'
      );
      assert.ok(
        await establishmentContainers[0]
          .$('h2=Confirm this establishment by selecting it from the list below')
          .isDisplayed()
      );

      await establishmentContainers[0].$('label=Marvell Pharmaceutical').click();

      assert.ok(
        await establishmentContainers[1].$('.review').$('p=Mini Pharm').isDisplayed(),
        'Expected free text establishment to be played back'
      );
      assert.ok(
        await establishmentContainers[1]
          .$('h2=Confirm this establishment by selecting it from the list below')
          .isDisplayed()
      );

      await establishmentContainers[1].$('label=Small Pharma').click();

      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      await submitAmendment(browser, title);

      await browser.withUser('inspector');
      await browser.gotoOutstandingTasks();
      await browser.$(`[title="${title}"]`).$('a=PPL amendment').click();
      await browser.$('label=Amend licence').click();
      await browser.$('button=Continue').click();

      await browser.completeHba();

      await browser.$('button=Amend licence').click();

      await browser.withUser('pharmaadmin');
      await gotoProjectList(browser, 'Marvell Pharmaceutical');

      assert.ok(await browser.$(`a=${title}`).isDisplayed(), 'Expected link to additional availability project');
      await browser.$(`a=${title}`).click();

      assert.equal(await browser.$('.document-header h2').getText(), title);

      await browser.$('a=View licence').click();

      const additionalEsts = await browser.$('h3=Additional establishments').$('..');

      assert.ok(await additionalEsts.$('li=Marvell Pharmaceutical').isDisplayed());
      assert.ok(await additionalEsts.$('li=Small Pharma').isDisplayed());
    });

    it('displays additional availability on projects when viewing the profile at the primary establishment', async () => {
      await browser.withUser('additionalavailability');
      await gotoProfile(browser, 'AA User', 'University of Croydon');
      const projectLink = await browser.$(`a=${title}`);
      const projectDetails = projectLink.$(function () {
        return this.closest('.project');
      });
      assert.ok(
        !(await projectDetails.$('//li[contains(.,"Primary availability at University of Croydon")]').isDisplayed()),
        'The project does not display its primary availability on a profile viewed at the primary establishment'
      );
      assert.ok(
        await projectDetails
          .$('//li[contains(.,"Additional availability at Marvell Pharmaceutical, Small Pharma")]')
          .isDisplayed(),
        'The project displays its additional availability on a profile viewed at the primary establishment'
      );
    });

    it('displays primary and additional availability on projects when viewing the profile at additional establishment(s)', async () => {
      await browser.withUser('additionalavailability');
      await gotoProfile(browser, 'AA User', 'Marvell Pharmaceutical');
      let projectDetails = await browser.$(`a=${title}`).closest('.project');
      assert.ok(
        await projectDetails.$('//li[contains(.,"Primary availability at University of Croydon")]').isDisplayed(),
        'The project displays its primary availability on a profile viewed at an AA establishment'
      );
      assert.ok(
        await projectDetails
          .$('//li[contains(.,"Additional availability at Marvell Pharmaceutical, Small Pharma")]')
          .isDisplayed(),
        'The project displays its additional availability on a profile viewed at an AA establishment'
      );

      await gotoProfile(browser, 'AA User', 'Small Pharma');

      projectDetails = await browser.$(`a=${title}`).closest('.project');
      assert.ok(
        await projectDetails.$('//li[contains(.,"Primary availability at University of Croydon")]').isDisplayed(),
        'The project displays its primary availability on a profile viewed at an AA establishment'
      );
      assert.ok(
        await projectDetails
          .$('//li[contains(.,"Additional availability at Marvell Pharmaceutical, Small Pharma")]')
          .isDisplayed(),
        'The project displays its additional availability on a profile viewed at an AA establishment'
      );
    });
  });
});
