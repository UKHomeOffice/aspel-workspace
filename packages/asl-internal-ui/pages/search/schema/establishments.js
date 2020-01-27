module.exports = {
  id: {
    filter: false
  },
  name: {
    show: true
  },
  status: {
    show: true,
    filter: true
  },
  licenceNumber: {},
  issueDate: {},
  revocationDate: {},
  inspector: {
    show: true,
    sortable: false,
    toCSVString: (val, establishment) => {
      return establishment.asru
        .filter(p => p.asruInspector)
        .map(profile => `${profile.firstName} ${profile.lastName}`)
        .join(', ');
    }
  },
  spoc: {
    show: true,
    sortable: false,
    toCSVString: (val, establishment) => {
      return establishment.asru
        .filter(p => p.asruLicensing)
        .map(profile => `${profile.firstName} ${profile.lastName}`)
        .join(', ');
    }
  }
};
