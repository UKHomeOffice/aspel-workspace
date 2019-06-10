const { merge } = require('lodash');
const place = require('../../../place/content');

module.exports = merge({}, place, {
  updateTitle: 'Review licensed premises change request',
  createTitle: 'Review licensed premises creation',
  deleteTitle: 'Review licensed premises deletion',
  'sticky-nav': {
    details: 'Establishment details',
    create: 'Approved area to add',
    delete: 'Approved area to remove',
    diff: 'Changes requested',
    restrictions: 'Current restrictions',
    'changes-to-restrictions': 'Requested changes to restrictions',
    'new-restrictions': 'New restrictions',
    status: 'Make decision'
  },
  fields: {
    changesToRestrictions: {
      label: 'Requested changes to restrictions'
    },
    comment: {
      label: 'Comments'
    }
  }
});
