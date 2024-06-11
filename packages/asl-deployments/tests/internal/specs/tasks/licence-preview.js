import assert from 'assert';
import { gotoProjectManagementPage } from '../../helpers/project.js';

describe('Project Licence preview', () => {

  it('does not include inpector comments in the preview licence', async() => {

    const comment = 'Comment content added by inspector';
    await browser.withUser('inspector');
    await gotoProjectManagementPage(browser, 'Draft Application');
    await browser.$('a=View task').click();
    await browser.$('a=View latest submission').click();
    await browser.$('a=Action plan').click();

    await browser.$('.objective-review').$('button=Add comment').click();
    await browser.$('textarea[name="add-new-comment"]').setValue(comment);
    await browser.$('button=Save').click();
    await browser.$(`p=${comment}`).waitForDisplayed();

    await browser.$('a=List of sections').click();
    await browser.$('a=Preview licence').click();
    await browser.$('a=Action plan').click();

    assert.ok(!await browser.$('.comments').isDisplayed(), 'comments should not appear in licence preview');
    assert.ok(!await browser.$(`p=${comment}`).isDisplayed(), 'comments should not appear in licence preview');
  });

});
