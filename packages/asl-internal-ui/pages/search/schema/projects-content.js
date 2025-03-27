module.exports = {
  title: {
    show: true,
    sortable: false
  },
  establishment: {
    toCSVString: (val, row) => row.establishment.name
  },
  licenceNumber: {},
  licenceHolder: {
    toCSVString: (val, row) => `${row.licenceHolder.firstName} ${row.licenceHolder.lastName}`
  },
  status: {}
};
