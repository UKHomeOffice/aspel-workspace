module.exports = {
  title: {
    show: true
  },
  establishment: {
    show: true,
    sort: 'establishment.name',
    toCSVString: row => row.establishment.name
  },
  licenceNumber: {},
  licenceHolder: {
    show: true,
    sort: 'licenceHolder.lastName',
    toCSVString: row => `${row.licenceHolder.firstName} ${row.licenceHolder.lastName}`
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
