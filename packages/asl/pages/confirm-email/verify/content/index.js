const base = require('../../content');

module.exports = {
  ...base,
  title: 'Email address confirmed',
  content: `
    Your account has been set up.
  `,
  error: {
    title: 'There was a problem confirming your email address',
    content: `
      You can resend the email confirming your address to **{{email}}**.

      To change your email address, email [aspeltechnicalqueries@homeoffice.gov.uk](mailto:aspeltechnicalqueries@homeoffice.gov.uk).
    `
  },
  buttons: {
    submit: 'Resend email',
    continue: 'Continue'
  }
};
