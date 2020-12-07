const searchPanel = require('../../components/search-panel/content');
const establishments = require('./establishments');
const profiles = require('./profiles');
const baseProjects = require('@asl/pages/pages/project/content');
const projects = require('./projects');
const projectsContent = require('./projects-content');

const models = {
  establishments,
  profiles,
  projects: {
    ...baseProjects,
    ...projects
  },
  'projects-content': projectsContent
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
  },
  results: {
    filtered: {
      singular: 'Showing {{count}} result for: **\'{{searchTerm}}\'**',
      plural: 'Showing {{count}} results for: **\'{{searchTerm}}\'**'
    }
  }
});
