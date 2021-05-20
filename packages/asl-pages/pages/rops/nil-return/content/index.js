module.exports = {
  title: 'Return of procedures {{year}}',
  subtitle: 'Submit nil return',
  reason: '**Reason for nil return:** {{^noProcs}}Only protected embryonic forms used in {{year}}{{/noProcs}}{{#noProcs}}No procedures completed in {{year}}{{/noProcs}}',
  buttons: {
    submit: 'Submit nil return'
  }
};
