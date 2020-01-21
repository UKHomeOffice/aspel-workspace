module.exports = {
  firstName: {},
  lastName: {
    show: true
  },
  email: {
    show: true
  },
  telephone: {},
  establishments: {
    show: true,
    sortable: false,
    toCSVString: (val, row) => row.establishments.map(e => e.name).join(', ')
  }
};
