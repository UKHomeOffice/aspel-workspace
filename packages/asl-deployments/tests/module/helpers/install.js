import withUser from './with-user.js';
import { download, downloadFile } from './download-file.js';
import waitForSync from './wait-for-sync.js';
import waitForSuccess from './wait-for-success.js';
import selectMany from './select-many.js';
import autocomplete from './autocomplete.js';
import completeRichText from './complete-rich-text.js';
import richTextImage from './rich-text-image.js';
import { closest } from './closest.js';

const addHelpers = config => {
  browser.setTimeout({ implicit: 500 });
  browser.addCommand('autocomplete', autocomplete);
  browser.addCommand('withUser', withUser(config));
  browser.addCommand('downloadFile', downloadFile);
  browser.addCommand('waitForSync', waitForSync);
  browser.addCommand('waitForSuccess', waitForSuccess);
  browser.addCommand('selectMany', selectMany);

  // true as third argument extends element - i.e. `browser.$(selector).completeRichText('words')`
  browser.addCommand('completeRichText', completeRichText, true);
  browser.addCommand('richTextImage', richTextImage, true);
  browser.addCommand('download', download, true);
  browser.addCommand('closest', closest(config), true);

  // add elaborate implementation of `.click()` to deal with floating elements that might block the click
  browser.overwriteCommand('click', async function (click) {
    try {
      return await click();
    } catch (e) {
      // first attempt at clicking failed - try scrolling to view
      this.scrollIntoView({ block: 'end' });
      try {
        return await click();
      } catch (e) {
        // still can't click, use js to force it
        return browser.execute(el => el.click(), this);
      }
    }
  }, true);
};

export const install = {
  withUser,
  download,
  downloadFile,
  waitForSuccess,
  waitForSync,
  selectMany,
  autocomplete,
  completeRichText,
  richTextImage,
  closest,
  addHelpers
};
