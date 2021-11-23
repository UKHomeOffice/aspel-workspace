module.exports = {
  cjsmEmail: {
    inputType: 'inputText',
    validate: [
      {
        match: /^(\S+@\S+)?$/
      }
    ]
  }
};
