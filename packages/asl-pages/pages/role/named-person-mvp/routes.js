const beforeYouApply = require('./before-you-apply');
const create = require('./apply');
const mandatoryTraining = require('./mandatory-training');
const confirm = require('./confirm');

module.exports = {
  beforeYouApply: {
    path: '/before-you-apply',
    router: beforeYouApply,
    breadcrumb: false
  },
  create: {
    path: '/create',
    router: create,
    breadcrumb: false
  },
  mandatoryTraining: {
    path: '/mandatory-training',
    router: mandatoryTraining,
    breadcrumb: false
  },
  confirm: {
    path: '/confirm',
    router: confirm,
    breadcrumb: false
  }
};
