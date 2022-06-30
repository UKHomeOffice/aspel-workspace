const { merge } = require('lodash');
const baseContent = require('@asl/pages/pages/task/list/content');
const profileContent = require('@asl/pages/pages/profile/read/content');

module.exports = merge({}, baseContent, profileContent, {
  pageTitle: 'Home',
  tasklist: {
    title: 'Tasks',
    outstanding: {
      none: 'You have no outstanding tasks',
      some: 'You have {{count}} outstanding tasks'
    }
  },
  establishment: {
    description: 'View establishment details including people, projects and areas.',
    link: 'Go to {{name}}',
    blocked: `
      Your access to this establishment has been blocked.

      Email [aspeltechnicalqueries@homeoffice.gov.uk](mailto:aspeltechnicalqueries@homeoffice.gov.uk) for more information.
    `
  },
  warnings: {
    personal: {
      pilReview: {
        due: `Personal licence {{alert.model.licenceNumber}} is due a review by {{alert.deadline}} to confirm it's still in use and up to date - [review licence details now]({{alert.url}})`,
        overdue: `Personal licence {{alert.model.licenceNumber}} is **overdue** a review confirming it's still in use and up to date - [review licence details now]({{alert.url}})`
      },
      raDue: {
        due: 'A retrospective assessment is due by {{alert.deadline}} for project licence {{alert.model.licenceNumber}} - [complete retrospective assessment now]({{alert.url}})',
        overdue: 'A retrospective assessment is **overdue** for project licence {{alert.model.licenceNumber}} - [complete retrospective assessment now]({{alert.url}})'
      },
      ropDue: {
        due: 'A return of procedures for {{alert.ropsYear}} is due by {{alert.deadline}} for project licence {{alert.model.licenceNumber}} - [complete return now]({{alert.url}})',
        overdue: 'A return of procedures for {{alert.ropsYear}} is **overdue** for project licence {{alert.model.licenceNumber}} - [complete return now]({{alert.url}})'
      }
    },
    establishment: {
      has: `{{name}} has:`,
      pilReview: {
        due: '{{due}} personal licence {{reviews}} due in less than a month - [go to personal licences]({{pilsUrl}})',
        overdue: '{{overdue}} **overdue personal licence {{reviews}}** - [go to personal licences]({{pilsUrl}})',
        both: '{{overdue}} **overdue** personal licence {{reviews}} and {{due}} due in less than a month - [go to personal licences]({{pilsUrl}})'
      },
      raDue: {
        due: '{{due}} retrospective {{assessments}} due in less than a month - [go to retrospective assessments]({{rasUrl}})',
        overdue: '{{overdue}} **overdue retrospective {{assessments}}** - [go to retrospective assessments]({{rasUrl}})',
        both: '{{overdue}} **overdue retrospective {{assessments}}** and {{due}} due in less than a month - [go to retrospective assessments]({{rasUrl}})'
      },
      ropDue: {
        due: '{{due}} {{returns}} of procedures due in less than a month - [go to returns of procedures]({{ropsUrl}})',
        overdue: '{{overdue}} **overdue {{returns}} of procedures** - [go to returns of procedures]({{ropsUrl}})',
        both: '{{overdue}} **overdue {{returns}} of procedures** and {{due}} due in less than a month - [go to returns of procedures]({{ropsUrl}})'
      }
    }
  }
});
