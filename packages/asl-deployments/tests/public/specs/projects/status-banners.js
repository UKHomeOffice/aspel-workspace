import assert from 'assert';
import { gotoProjectLandingPage, gotoDraft, gotoGranted, gotoExpired, gotoRevoked, gotoHistoryTab } from '../../helpers/project.js';

describe('Status banners', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  describe('Active projects', () => {

    it('Shows no banner on project landing page', async() => {
      await gotoProjectLandingPage(browser, 'Basic user project');
      assert.ok(!await browser.$('.licence-status-banner').isDisplayed(), 'Status banner is present');

    });

    it('Shows no banner on project version page', async() => {
      await gotoGranted(browser, 'Basic user project');
      assert.ok(!await browser.$('.licence-status-banner').isDisplayed(), 'Status banner is present');
    });

  });

  describe('Expired projects', () => {

    it('Shows an expired banner on project landing page', async() => {
      await gotoProjectLandingPage(browser, 'Search for the luminescent aether', 'Expired');

      const text = await browser.$('.licence-status-banner .status').getText();
      assert.equal(text, 'EXPIRED');
      assert.ok(await browser.$('.licence-status-banner.expired').isDisplayed(), 'Status banner should have "expired" class');
    });

    it('Shows an expired banner on project version page', async() => {
      await gotoExpired(browser, 'Search for the luminescent aether');

      const text = await browser.$('.licence-status-banner .status').getText();
      assert.equal(text, 'EXPIRED');
      assert.ok(await browser.$('.licence-status-banner.expired').isDisplayed(), 'Status banner should have "expired" class');
    });

  });

  describe('Draft projects', () => {

    it('Shows a draft banner on project landing page', async() => {
      await gotoProjectLandingPage(browser, 'Draft project', 'Drafts');

      const text = await browser.$('.licence-status-banner .status').getText();
      assert.equal(text, 'DRAFT');
      assert.ok(await browser.$('.licence-status-banner.inactive').isDisplayed(), 'Status banner should have "inactive" class');
    });

    it('Shows a draft banner on project version page', async() => {
      await gotoDraft(browser, 'Draft project');

      const text = await browser.$('.licence-status-banner .status').getText();
      assert.equal(text, 'DRAFT');
      assert.ok(await browser.$('.licence-status-banner.inactive').isDisplayed(), 'Status banner should have "inactive" class');
    });

  });

  describe('Revoked projects', () => {

    it('Shows a revoked banner on project landing page', async() => {
      await gotoProjectLandingPage(browser, 'Revoked project', 'Revoked');

      const text = await browser.$('.licence-status-banner .status').getText();
      assert.equal(text, 'REVOKED');
      assert.ok(await browser.$('.licence-status-banner.revoked').isDisplayed(), 'Status banner should have "revoked" class');
    });

    it('Shows a revoked banner on project version page', async() => {
      await gotoRevoked(browser, 'Revoked project');

      const text = await browser.$('.licence-status-banner .status').getText();
      assert.equal(text, 'REVOKED');
      assert.ok(await browser.$('.licence-status-banner.revoked').isDisplayed(), 'Status banner should have "revoked" class');
    });

  });

  describe('Superseded projects', () => {

    it('shows a superseded banner on old granted versions', async() => {
      await gotoProjectLandingPage(browser, 'Project with multiple versions');
      await gotoHistoryTab(browser);
      await browser.$('a=View the licence granted on 1 January 2023.').click();

      const text = await browser.$('.licence-status-banner .status').getText();
      assert.equal(text, 'SUPERSEDED');
      assert.ok(await browser.$('.licence-status-banner.red').isDisplayed(), 'Status banner should have "red" class');
    });

    it('shows correct end date in banner on old granted versions', async() => {
      await gotoProjectLandingPage(browser, 'Project with multiple versions');
      await gotoHistoryTab(browser);
      await browser.$('a=View the licence granted on 1 January 2023.').click();

      await browser.$('.licence-status-banner').$('a=Show more').click();

      assert.ok(await browser.$('.licence-status-banner').$('p=This version was valid from 1 January 2023 until 1 April 2023').isDisplayed(), 'Status banner should show correct start and end dates');
    });

  });

});
