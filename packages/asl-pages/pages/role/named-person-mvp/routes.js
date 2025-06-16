const beforeYouApply = require('./before-you-apply');
const selectRole = require('./select-role');
const mandatoryTraining = require('./mandatory-training');
const incompleteTraining = require('./incomplete-training');
const nvsModule = require('./nvs-module');
const confirm = require('./confirm');

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
  nvsModule: {
    path: '/nvs-module',
    router: nvsModule,
    breadcrumb: false
  },
  confirm: {
    path: '/confirm',
    router: confirm,
    breadcrumb: false
  }
};
