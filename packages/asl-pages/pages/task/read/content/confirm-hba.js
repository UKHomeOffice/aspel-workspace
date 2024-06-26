const { merge } = require('lodash');
const baseContent = require('./base');
const tasks = require('../../content/tasks');

module.exports = merge({}, baseContent, {
  tasks,
  title: 'Confirm HBA file',

  fields: {
    establishment: {
      label: 'Establishment:'
    },
    currentEstablishment: {
      label: 'Current establishment:'
    },
    proposedEstablishment: {
      label: 'Proposed establishment:'
    },
    applicant: {
      label: 'Applicant:'
    },
    pplHolder: {
      label: 'PPL holder:'
    },
    currentPPLHolder: {
      label: 'Current PPL licence holder:'
    },
    proposedPPLHolder: {
      label: 'Proposed PPL licence holder:'
    },
    hbaFilename: {
      label: 'Selected HBA file:',
      download: 'Download file'
    },
    confirmHba: {
      label: 'What do you want to do?',
      options: {
        yes: {
          application: 'Confirm and continue to grant licence',
          transfer: 'Confirm and continue to approve transfer',
          amendment: 'Confirm and continue to amend licence'
        },
        no: 'Discard selected file and choose another'
      }
    }
  },
  warning: {
    application: 'Once confirmed, this HBA file in ASPeL (not SharePoint) will be the single point of reference for this application, for future assessment and audit purposes.',
    transfer: 'Once confirmed, this HBA file in ASPeL (not SharePoint) will be the single point of reference for this transfer request, for future assessment and audit purposes.',
    amendment: 'Once confirmed, this HBA file in ASPeL (not SharePoint) will be the single point of reference for this amendment, for future assessment and audit purposes.'
  },
  errors: {
    confirmHba: {
      required: 'Select an option',
      definedValues: 'Select from one of the provided options'
    }
  }
});
