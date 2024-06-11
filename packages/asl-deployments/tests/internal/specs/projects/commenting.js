import assert from 'assert';
import { findTask } from '../../../helpers/task.js';

describe('Comment on a project', () => {

  before(async () => {
    await browser.withUser('inspector');
    await browser.url('/');
    await browser.gotoOutstandingTasks();
    await (await findTask(browser, '[title="Amend in prog project"]')).$('a=PPL amendment').click();
    await browser.$('a=View latest submission').click();
    await browser.$('a=Introductory details').click();
  });

  it('can add comments to a question', async () => {
    await browser.$('button=Add comment').click();
    await browser.$('textarea[name="add-new-comment"]').setValue('My new comment');
    await browser.$('button=Save').click();

    await browser.$('.comment.isNew').waitForDisplayed();

    assert.equal(await browser.$('.comment.isNew .content p').getText(), 'My new comment');
    assert.ok(browser.$('.comment.isNew').$('button=Edit').isDisplayed(), 'Edit button should be visible');
    assert.ok(browser.$('.comment.isNew').$('button=Delete').isDisplayed(), 'Delete button should be visible');
  });

  it('can edit comments', async () => {
    await browser.$('.comment.isNew').$('button=Edit').click();
    await browser.$('textarea[name*="edit-comment"]').setValue('My edited comment');
    await browser.$('button=Save').click();

    await browser.waitUntil(async () => !await browser.$('textarea[name*="edit-comment"]').isDisplayed());

    assert.equal(await browser.$('.comment.isNew .content p').getText(), 'My edited comment');
    await browser.refresh();
    assert.equal(await browser.$('.comment.isNew .content p').getText(), 'My edited comment');
  });

  it('can delete comments', async () => {
    await browser.$('.comment.isNew').$('button=Delete').click();

    await browser.$('.comment.deleted').waitForDisplayed();

    const content = await browser.$('.comment.deleted .content').getText();
    assert.equal(content, 'This comment has been deleted');
  });

  it('can delete a comment after adding', async () => {
    await browser.$('button=Add comment').click();
    await browser.$('textarea[name="add-new-comment"]').setValue('My comment to be deleted');
    await browser.$('button=Save').click();

    const el = await browser.$('.comment.isNew:not(.deleted)');

    await el.waitForDisplayed();

    assert.equal(await el.$('.content p').getText(), 'My comment to be deleted');
    await el.$('button=Delete').click();

    await browser.waitUntil(async () => {
      const commentDeleted = await browser.$$('.comment.deleted');
      return commentDeleted.length === 2;
    });
    assert.ok(!await browser.$('p=My comment to be deleted').isDisplayed());
    const content = await browser.$$('.comment.deleted')[1].$('.content').getText();
    assert.equal(content, 'This comment has been deleted');

  });

});
