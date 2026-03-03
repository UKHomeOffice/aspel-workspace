const { merge } = require('lodash');
const baseContent = require('./index');
const { breadcrumbs } = require('../../../common/content');

module.exports = merge({}, baseContent, {
    breadcrumbs: {
        role: {
            namedPersonMvp: {
                index: 'Create'
            }
        }
    }
});