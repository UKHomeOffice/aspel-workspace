const content = require('../content/index');

module.exports = (role) => {
  return {
    declarationAgreement: {
      inputType: 'declaration',
      title: declarationAgreementContent(role),
      validate: ['required']
    }
  };
};

const declarationAgreementContent = (role) => {
  const { type } = role;
  if (['nacwo', 'nvs'].includes(type)) {
    return content.declarationNACWODesc;
  } else {
    return content.declarationOtherDesc;
  }
};
