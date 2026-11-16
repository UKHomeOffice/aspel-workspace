const {merge} = require('lodash');
const baseContent = require('./base');
const tasks = require('../../content/tasks');

module.exports = merge({}, baseContent, {
  tasks,
  title: 'Upload harm benefit analysis file',
  intro: {
    template: `To {{actionToContent}} you must upload the PPL assessment form containing the harm benefit analysis (HBA) for this {{type}}.

The HBA will be visible to ASRU only. \n\nYou can review and confirm the file you've chosen before {{actionContent}}. You can also update the file in the future, if required.`,
    actionToContent: {
      update: 'amend the licence',
      transfer: 'approve this transfer',
      default: '{{action}} this licence'
    },
    actionContent: {
      update: 'amending the licence',
      transfer: 'approving this transfer',
      default: '{{action}}ing the licence'
    }
  },
  fields: {
    upload: {
      label: 'Upload {{#model.hbaToken}}new {{/model.hbaToken}}file',
      hint: 'The file must be a doc, docx or pdf. The maximum size is 15MB.',
      actionContent: {
        update: 'amending the licence',
        transfer: 'approving this transfer',
        default: '{{action}}ing the licence'
      }
    },
    hba: {
      label: 'Selected harm benefit analysis file'
    }
  },
  errors: {
    upload: {
      fileRequired: 'Choose a harm benefit analysis file',
      invalidFileContent: 'The chosen file content does not match a doc, docx or pdf file',
      malwareDetected: 'The chosen file could not be uploaded because it appears to contain malicious content',
      maxSize: 'The chosen file must be smaller than 15MB',
      ext: 'The chosen file must be a doc, docx or pdf',
      unsupportedFileType: 'The chosen file must be a doc, docx or pdf'
    }
  }
});
