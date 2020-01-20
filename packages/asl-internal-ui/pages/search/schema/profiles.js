module.exports = {
  firstName: {},
  lastName: {
    show: true
  },
  email: {
    show: true
  },
  phone: {},
  establishments: {
    show: true,
    sortable: false,
    toCSVString: row => row.establishments.map(e => e.name).join(', ')
  }
};
