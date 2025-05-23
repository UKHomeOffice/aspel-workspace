const beforeYouApply = require('./before-you-apply');
const selectRole = require('./select-role');
const mandatoryTraining = require('./mandatory-training');
const incompleteTraining = require('./incomplete-training');
const confirm = require('./confirm');
const success = require('./success');

module.exports = {
  beforeYouApply: {
    path: '/before-you-apply',
    router: beforeYouApply,
    breadcrumb: false
  },
  create: {
    path: '/create',
    router: selectRole,
    breadcrumb: false
  },
  mandatoryTraining: {
    path: '/mandatory-training',
    router: mandatoryTraining,
    breadcrumb: false
  },
  incompleteTraining: {
    path: '/incomplete-training',
    router: incompleteTraining,
    breadcrumb: false
  },
  confirm: {
    path: '/confirm',
    router: confirm,
    breadcrumb: false
  },
  success: {
    path: '/success',
    router: success,
    breadcrumb: false
  }
};
