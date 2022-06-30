module.exports = {
  title: 'Check your email',
  breadcrumbs: {
    confirmEmail: 'Confirm email'
  },
  notifications: {
    'email-sent': 'Email sent to {{email}}'
  },
  content: `
    We need to confirm your email address to finish setting up your account.

    We have sent an email to **{{email}}** with a link to confirm your address.

    If you can't find the email, check your junk folder or resend the email. To change your email address, email [aspeltechnicalqueries@homeoffice.gov.uk](mailto:aspeltechnicalqueries@homeoffice.gov.uk).
  `,
  buttons: {
    submit: 'Resend email'
  }
};
