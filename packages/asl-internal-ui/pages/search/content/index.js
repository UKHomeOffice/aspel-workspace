const establishments = require('./establishments');
const profiles = require('./profiles');
const baseProjects = require('@asl/pages/pages/project/content');
const projects = require('./projects');
const projectsContent = require('./projects-content');
const tasks = require('./tasks');

const models = {
  establishments,
  profiles,
  projects: {
    ...baseProjects,
    ...projects
  },
  'projects-content': projectsContent,
  tasks
};

module.exports = (searchType) => ({
  breadcrumbs: {
    search: 'Search'
  },
  ...models[searchType],
  searchPanel: {
    title: 'Search',
    clearSearch: 'Clear search',
    clearAll: 'Clear all',
    projectToggle: {
      projects: 'Search all projects for specific terms',
      'projects-content': '< Back to project directory'
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
      title: 'Search all projects',
      label: 'Enter a search term'
    },
    tasks: {
      title: 'Search all tasks',
      label: 'Search tasks by applicant, licence holder, licence number or project title'
    }
  },
  actions: {
    establishment: {
      create: 'Create inactive establishment'
    }
  },
  results: {
    filtered: {
      singular: 'Showing {{count}} result{{#searchTerm}} for: **\'{{searchTerm}}\'**{{/searchTerm}}',
      plural: 'Showing {{count}} results{{#searchTerm}} for: **\'{{searchTerm}}\'**{{/searchTerm}}'
    }
  }
});
