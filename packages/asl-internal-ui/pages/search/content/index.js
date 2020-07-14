const searchPanel = require('../../components/search-panel/content');
const establishments = require('./establishments');
const profiles = require('./profiles');
const baseProjects = require('@asl/pages/pages/project/content');
const projects = require('./projects');

const models = {
  establishments,
  profiles,
  projects: {
    ...baseProjects,
    ...projects
  }
};

module.exports = (searchType) => ({
  breadcrumbs: {
    search: 'Search'
  },
  ...models[searchType],
  searchPanel,
  actions: {
    establishment: {
      create: 'Create inactive establishment'
    }
  }
});
