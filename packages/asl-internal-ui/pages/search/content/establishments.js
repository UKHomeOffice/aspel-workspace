module.exports = {
  pageTitle: 'Search establishments',
  fields: {
    name: {
      label: 'Name'
    },
    licenceNumber: {
      label: 'PEL number'
    },
    status: {
      label: 'Status'
    }
  },
  status: {
    active: 'Active',
    inactive: 'Draft',
    expired: 'Expired',
    revoked: 'Revoked'
  }
};
