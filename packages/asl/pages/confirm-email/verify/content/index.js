const base = require('../../content');

module.exports = {
  ...base,
  title: 'Email verified',
  content: `
    Your email address has been verified.

    You can now access this service.
  `,
  error: {
    title: 'There was a problem verifying your email address',
    content: `
      Your email address could not be verified. Click the button below to resend a confirmation email to **{{email}}**.

      If your email address is incorrect, or you do not have access to this address then please contact [aspelqueries@homeoffice.gov.uk](mailto:aspelqueries@homeoffice.gov.uk).
    `
  },
  buttons: {
    submit: 'Resend email',
    continue: 'Continue'
  }
}