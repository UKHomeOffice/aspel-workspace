module.exports = {
  profile: {
    accessor: 'data.subject',
    sort: ['data.modelData.profile.lastName', 'data.modelData.profile.firstName'],
    show: true
  },
  organisation: {
    show: true,
    accessor: 'data.data.organisation',
    sortable: false
  },
  licenceDetails: {
    show: true,
    sortable: false
  },
  status: {
    show: true,
    sortable: false
  },
  action: {
    show: true,
    sortable: false
  }
};
