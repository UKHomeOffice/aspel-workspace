module.exports = {
  title: 'Verify email',
  breadcrumbs: {
    confirmEmail: 'Verify email'
  },
  notifications: {
    'email-sent': 'Email sent to {{email}}'
  },
  content: `
    You need to verify your email address to use this service.

    You should have received an email to **{{email}}** with a link to confirm your account details.

    If you have not received an email, click the button below to resend.
  `,
  buttons: {
    submit: 'Resend email'
  }
}