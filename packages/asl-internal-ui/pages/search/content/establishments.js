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
    },
    inspector: {
      label: 'Inspector'
    },
    spoc: {
      label: 'SPoC'
    }
  },
  status: {
    active: 'Active',
    inactive: 'Draft',
    expired: 'Expired',
    revoked: 'Revoked'
  }
};
