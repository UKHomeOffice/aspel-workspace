const update = require('./update');
const guidance = require('./guidance');
const nilReturn = require('./nil-return');
const procedures = require('./procedures');
const submit = require('./submit');

module.exports = {
  update: {
    path: '/update/:step',
    breadcrumb: false,
    router: update
  },
  guidance: {
    path: '/guidance',
    breadcrumb: false,
    router: guidance
  },
  'nil-return': {
    path: '/nil-return',
    breadcrumb: false,
    router: nilReturn
  },
  procedures: {
    path: '/procedures',
    breadcrumb: false,
    router: procedures
  },
  submit: {
    path: '/submit',
    breadcrumb: false,
    router: submit
  }
};
