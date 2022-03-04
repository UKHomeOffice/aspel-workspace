module.exports = {
  updatedAt: {
    show: true
  },
  establishment: {
    show: true,
    sortable: false,
    accessor: 'establishment.name'
  },
  type: {
    show: true,
    sortable: false,
    accessor: 'action'
  },
  status: {
    show: true,
    sortable: false
  },
  activeDeadline: {
    show: true,
    sortable: true
  },
  assignedTo: {
    show: true,
    sortable: false
  }
};
