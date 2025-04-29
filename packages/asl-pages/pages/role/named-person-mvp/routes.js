const beforeYouApply = require('./before-you-apply');
const create = require('./apply');
const mandatoryTraining = require('./mandatory-training');
const confirm = require('./routers/confirm');

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
    path: '/confirms',
    router: confirm,
    breadcrumb: false
  }
};
