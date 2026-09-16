const { merge } = require('lodash');
const baseContent = require('../../content');

module.exports = merge({}, baseContent, {
  replacementHbaParagraph: `You can replace the current HBA file if there has been an admin error, for example:
- section boxes have not been ticked
- the form has not been signed
- the wrong file has been uploaded by mistake
\n
Ensure you have the consent of the inspector who assessed this application.`,
  buttons: {
    submit: 'Continue'
  },
  fields: {
    upload: {
      label: '## Replacement HBA file'
    },
    hba: {
      label: 'Selected harm benefit analysis file'
    }
  },
  errors: {
    upload: {
      fileRequired: 'Choose a replacement HBA file',
      invalidFileContent: 'The selected file contents do not match a .doc, .docx or .pdf file',
      malwareDetected: 'The selected file could not be uploaded because it appears to contain malicious content',
      maxSize: 'The harm benefit analysis file should be smaller than 15MB',
      ext: 'The selected file must be a .doc, .docx or .pdf',
      unsupportedFileType: 'The selected file must be a .doc, .docx or .pdf'
    }
  }
});
