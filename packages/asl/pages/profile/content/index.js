const { merge } = require('lodash');
const profileContent = require('@asl/pages/pages/profile/read/content');
const pilContent = require('@asl/pages/pages/task/read/content/pil');

module.exports = merge({}, pilContent, profileContent, {
  establishment: {
    link: 'About this establishment'
  },
  pil: {
    training: {
      title: 'Training'
    }
  }
});
