module.exports = {
  id: {},
  name: {
    show: true,
    accessor: 'profile.name'
  },
  type: {
    show: true
  },
  places: {
    show: true
  },
  profile: {
    show: true,
    searchable: false,
    sortable: false,
    accessor: 'profile.id'
  }
};
