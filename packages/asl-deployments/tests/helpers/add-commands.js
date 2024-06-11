import gotoTasks from './goto-tasks.js';
import autocomplete from './autocomplete.js';
import withUser from '../module/helpers/with-user.js';
import waitForSuccess from '../module/helpers/wait-for-success.js';
import waitForSync from '../module/helpers/wait-for-sync.js';
import {download, downloadFile} from '../module/helpers/download-file.js';
import {closest} from '../module/helpers/closest.js';
import browserAutocomplete from '../module/helpers/autocomplete.js';
import completeRichText from '../module/helpers/complete-rich-text.js';
import richTextImage from '../module/helpers/rich-text-image.js';
import completeHba from './complete-hba.js';

export default function (config) {
  browser.addCommand('withUser', withUser(config));
  browser.addCommand('waitForSuccess', waitForSuccess);
  browser.addCommand('waitForSync', waitForSync);
  browser.addCommand('download', download, true);
  browser.addCommand('downloadFile', downloadFile);
  browser.addCommand('closest', closest(config), true);
  browser.addCommand('gotoOutstandingTasks', gotoTasks('Outstanding'));
  browser.addCommand('gotoInProgressTasks', gotoTasks('In progress'));
  browser.addCommand('gotoCompletedTasks', gotoTasks('Completed'));

  browser.addCommand('autocomplete', autocomplete, true);
  browser.addCommand('browserAutocomplete', browserAutocomplete);
  browser.addCommand('completeRichText', completeRichText, true);
  browser.addCommand('richTextImage', richTextImage, true);

  browser.addCommand('completeHba', completeHba);
}
