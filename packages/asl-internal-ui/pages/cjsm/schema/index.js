module.exports = {
  cjsmEmail: {
    inputType: 'inputText',
    validate: [
      'required',
      {
        match: /^\S+@\S+$/
      }
    ]
  }
};
