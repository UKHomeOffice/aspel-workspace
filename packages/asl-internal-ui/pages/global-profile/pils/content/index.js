const { merge } = require('lodash');
const content = require('../../content');
const pilContent = require('@asl/pages/pages/pil/read/content');

module.exports = merge({}, content, pilContent, {
  fields: {
    pilTransfers: {
      label: 'Transfer history'
    },
    trainingNeed: {
      label: 'Training need'
    },
    project: {
      label: 'Project'
    }
  }
});
