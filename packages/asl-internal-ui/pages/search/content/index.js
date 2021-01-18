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
  searchPanel: {
    title: 'Search',
    viewAll: 'Clear search',
    projectToggle: {
      projects: 'Search all projects for specific terms',
      'projects-content': 'Back to project directory'
    },
    establishments: {
      title: 'Establishments',
      label: 'Search by establishment name, PEL number, inspector name or SPoC name'
    },
    profiles: {
      title: 'People',
      label: 'Search by name, email address or PIL number'
    },
    projects: {
      title: 'Projects',
      label: 'Search by title, primary establishment, PPL number or licence holder'
    },
    'projects-content': {
      title: 'Advanced project search',
      label: 'Search full application text'
    }
  },
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
