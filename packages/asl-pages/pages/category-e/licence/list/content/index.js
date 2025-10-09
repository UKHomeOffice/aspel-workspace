const baseContent = require('../../content');

module.exports = {
  from: __dirname,
  ...baseContent,
  noLicencesMessage: 'There are no category E PILs yet.',
  tableCaption:
    {
      $pluralisation: {
        countKey: 'datatable.pagination.count',
        0: '{{#datatable.filters.active.*}}' +
          'No Category E PILs matched your search' +
          '{{/datatable.filters.active.*}}{{^datatable.filters.active.*}}' +
          'There are no category E PILs yet.' +
          '{{/datatable.filters.active.*}}',
        1: '{{#datatable.filters.active.*}}' +
          'Showing {{ datatable.pagination.count }} search result' +
          '{{/datatable.filters.active.*}}{{^datatable.filters.active.*}}' +
          'All {{ datatable.pagination.totalCount }} Category E PIL' +
          '{{/datatable.filters.active.*}}',
        default: '{{#datatable.filters.active.*}}' +
          'Showing {{ datatable.pagination.count }} search results' +
          '{{/datatable.filters.active.*}}{{^datatable.filters.active.*}}' +
          'All {{ datatable.pagination.totalCount }} Category E PILs' +
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
