module.exports = {
  name: {
    show: true
  },
  licenceNumber: {
    show: true
  },
  numberOfPils: {
    show: true
  },
  totalCost: {
    accessor: 'numberOfPils',
    sort: 'numberOfPils',
    show: true
  }
};
