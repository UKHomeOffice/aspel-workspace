module.exports = {
  updatedAt: {
    show: true,
    sortable: false
  },
  establishment: {
    show: true,
    sortable: false,
    accessor: 'establishment.name'
  },
  licence: {
    show: true,
    sortable: false,
    accessor: 'model'
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
  assignedTo: {
    show: true,
    sortable: false
  }
};
