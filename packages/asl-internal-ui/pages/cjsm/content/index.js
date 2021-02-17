module.exports = {
  title: 'Enter CJSM email address',
  fields: {
    cjsmEmail: {
      label: ''
    }
  },
  errors: {
    cjsmEmail: {
      required: 'Enter the CJSM email address',
      match: 'Enter a valid email address'
    }
  },
  notifications: {
    success: 'CJSM email address updated'
  }
};
