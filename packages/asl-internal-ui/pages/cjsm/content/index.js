module.exports = {
  title: 'Enter CJSM email address',
  fields: {
    cjsmEmail: {
      label: ''
    }
  },
  errors: {
    cjsmEmail: {
      match: 'Enter a valid email address'
    }
  },
  notifications: {
    success: 'CJSM email address updated'
  }
};
