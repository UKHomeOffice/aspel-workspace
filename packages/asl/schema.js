module.exports = {
  places: {
    id: {},
    site: {
      show: true
    },
    area: {
      show: true
    },
    name: {
      show: true
    },
    suitability: {
      show: true
    },
    holding: {
      show: true
    },
    nacwo: {
      show: true,
      accessor: 'nacwo.profile.name'
    }
  },
  roles: {
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
      accessor: 'profile.id'
    }
  }
};
