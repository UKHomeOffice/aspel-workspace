const { merge } = require('lodash');
const baseContent = require('../../content');

module.exports = merge({}, baseContent, {
  replacementHbaParagraph: `You can replace the current HBA file if there has been an admin error, for example:
- section boxes have not been ticked
- the form has not been signed
- the wrong file has been uploaded by mistake`,
  buttons: {
    submit: 'Continue'
  }
});
