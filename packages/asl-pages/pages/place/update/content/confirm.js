const { merge } = require('lodash');
const commonContent = require('../../content');
const baseContent = require('./');

module.exports = merge({}, commonContent, baseContent, {
  declaration: 'By submitting this change, I confirm that I also have the consent of the Establishment Licence holder',
  subtitle: 'Update premises'
});
