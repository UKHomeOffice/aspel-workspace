const status = require('../../content/status');
const tasks = require('../../content/tasks');

module.exports = {
  status,
  tasks,
  title: 'Review {{type}}',
  currentStatus: 'Current status',
  fields: {
    status: {
      label: ''
    },
    comment: {
      label: 'Comments',
      hint: 'Any comments will be added to the activity log of this task. Comments can be seen by establishment users, as well as inspectors and Home Office team members.'
    }
  },
  'sticky-nav': {
    activity: 'Latest activity',
    establishment: 'Establishment details',
    comments: 'Comments',
    status: 'What do you want to do?',
    conditions: 'Additional conditions',
    withdraw: 'Withdraw {{type}}'
  },
  activityLog: {
    open: 'Show previous activity',
    close: 'Hide previous activity'
  },
  'make-decision': {
    hint: ''
  },
  task: {
    submittedBy: 'Submitted by',
    submittedOn: 'on {{date}}.',
    applicantName: 'Applicant name',
    withdrawAction: 'Withdraw {{type}}'
  },
  deadline: {
    hint: 'Click the button below to extend the deadline by 15 days.',
    extend: {
      title: 'Extend deadline by 15 days.',
      button: 'Extend deadline'
    }
  },
  actions: {
    change: 'Change',
    withdraw: 'Withdraw'
  },
  errors: {
    status: {
      required: 'Please approve or reject this task',
      definedValues: 'Please select an option from the list'
    },
    comment: {
      customValidate: 'Please provide a reason'
    }
  },
  buttons: {
    submit: 'Continue'
  }
};
