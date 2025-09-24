module.exports = {
  profile: {
    accessor: 'data.subject',
    sort: ['data.modelData.profile.lastName', 'data.modelData.profile.firstName'],
    show: true
  },
  courseTitle: {
    show: true,
    accessor: 'trainingCourse.title',
    sortable: false
  },
  startDate: {
    accessor: 'trainingCourse.startDate',
    show: true,
    sortable: false
  },
  details: {
    show: true,
    sortable: false
  },
  status: {
    show: true,
    sortable: false
  },
  actions: {
    show: true,
    sortable: false
  }
};
