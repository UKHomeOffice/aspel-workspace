module.exports = {
  title: {
    show: true
  },
  establishment: {
    show: true,
    sort: 'establishment.name',
    toCSVString: (val, row) => row.establishment.name
  },
  licenceNumber: {
    show: true
  },
  licenceHolder: {
    show: true,
    sort: 'licenceHolder.lastName',
    toCSVString: (val, row) => `${row.licenceHolder.firstName} ${row.licenceHolder.lastName}`
  },
  status: {
    show: true
  },
  issueDate: {},
  expiryDate: {
    show: true
  },
  revocationDate: {}
};
