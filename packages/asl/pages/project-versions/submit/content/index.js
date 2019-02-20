module.exports = {
  title: 'Submit to inspector',
  fields: {
    authority: {
      label: 'Do you have the authority of the Establishment Licence Holder to submit this application?'
    },
    awerb: {
      label: 'Has this application been through the AWERB process for each relevant establishment?'
    }
  },
  errors: {
    authority: {
      required: 'Select an option',
      customValidate: 'Confirm you have the authority of the Establishment Licence Holder before submitting'
    },
    awerb: {
      required: 'Select an option',
      customValidate: 'Confim the application has been through the AWERB process before submitting'
    }
  },
  buttons: {
    submit: 'Submit PPL application'
  }
};
