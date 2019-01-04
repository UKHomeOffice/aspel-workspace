const searchPanel = require('../../components/search-panel/content');
const establishments = require('./establishments');
const profiles = require('./profiles');
const projects = require('./projects');

const fields = {
  establishments,
  profiles,
  projects
};

module.exports = (searchType) => ({
  breadcrumbs: {
    search: 'Search'
  },
  searchPanel,
  fields: fields[searchType]
});
