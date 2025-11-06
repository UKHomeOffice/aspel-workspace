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
