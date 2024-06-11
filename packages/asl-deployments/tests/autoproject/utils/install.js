import completeHba from '../../helpers/complete-hba.js';
import gotoTasks from '../../helpers/goto-tasks.js';
import completeRichText from './complete-rich-text.js';
import gotoEstablishment from './goto-establishment.js';
import gotoPlaces from './goto-places.js';

export default () => {
  browser.setTimeout({ implicit: 1000 });
  browser.addCommand('gotoOutstandingTasks', gotoTasks('Outstanding'));
  browser.addCommand('gotoCompletedTasks', gotoTasks('Completed'));
  browser.addCommand('completeRichText', completeRichText, true);
  browser.addCommand('gotoEstablishment', gotoEstablishment);
  browser.addCommand('gotoPlaces', gotoPlaces);
  browser.addCommand('completeHba', completeHba);
};
