const baseContent = require('../../content');

module.exports = {
  ...baseContent,
  noLicencesMessage: 'There are no category E PILs yet.',
  tableCaption:
    {
      // The caption is different if the user has used the search bar to filter
      // the PIL tasks/licences or not. `datatable.filters.active.*` is falsey
      // if the table is not filtered, and truthy (an array with the term(s))
      // if a search term is filtering the table data.
      $pluralisation: {
        countKey: 'datatable.pagination.count',
        0: '{{#datatable.filters.active.*}}' +
          'No Category E PILs matched your search' +
          '{{/datatable.filters.active.*}}{{^datatable.filters.active.*}}' +
          'There are no category E PILs yet.' +
          '{{/datatable.filters.active.*}}',
        1: '{{#datatable.filters.active.*}}' +
          'Showing 1 search result' +
          '{{/datatable.filters.active.*}}{{^datatable.filters.active.*}}' +
          'All category E PILs' +
          '{{/datatable.filters.active.*}}',
        default: '{{#datatable.filters.active.*}}' +
          'Showing {{ datatable.pagination.count }} search results' +
          '{{/datatable.filters.active.*}}{{^datatable.filters.active.*}}' +
          'All {{ datatable.pagination.count }} category E PILs' +
          '{{/datatable.filters.active.*}}'
      }
    },
  search: {
    label: 'Search by name or email'
  },
  fields: {
    profile: {
      label: 'Name'
    },
    courseTitle: {
      label: 'Course title'
    },
    startDate: {
      label: 'Course date(s)'
    },
    licenceDetails: {
      label: 'Details'
    },
    status: {
      label: 'Status'
    },
    action: {
      label: 'Action'
    }
  }
};
