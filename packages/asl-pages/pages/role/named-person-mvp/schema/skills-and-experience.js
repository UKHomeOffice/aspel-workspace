module.exports = () => {

  return {
    experience: {
      inputType: 'textAreaWithWordCount',
      maxWordCount: 300,
      validate: ['lessThanOrEqualToMaxWordCount', 'required']

    },
    authority: {
      inputType: 'textAreaWithWordCount',
      maxWordCount: 300,
      validate: ['lessThanOrEqualToMaxWordCount', 'required']
    },
    skills: {
      inputType: 'textAreaWithWordCount',
      maxWordCount: 300,
      validate: ['lessThanOrEqualToMaxWordCount', 'required']
    }
  };
};
