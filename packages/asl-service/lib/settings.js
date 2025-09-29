const { cloneDeep, merge } = require('lodash');

module.exports = settings => {
  return merge(
    {
      urls: {},
      log: {
        level: 'info',
        format: 'combined',
        json: true
      },
      verboseErrors: false,
      root: process.cwd()
    },
    cloneDeep(settings)
  );
};
