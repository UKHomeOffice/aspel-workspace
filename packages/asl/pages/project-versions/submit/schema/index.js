const { omit } = require('lodash');
const content = require('../content');

const schema = {
  authority: {
    inputType: 'radioGroup',
    inline: true,
    className: 'smaller',
    options: [
      {
        value: 'Yes',
        label: 'Yes',
        reveal: [
          {
            name: 'authority-pelholder-name',
            inputType: 'inputText',
            label: content.fields['authority-pelholder-name'].label,
            validate: ['required']
          },
          {
            name: 'authority-endorsement-date',
            inputType: 'inputText',
            label: content.fields['authority-endorsement-date'].label,
            validate: ['required']
          }
        ]
      },
      {
        value: 'Not yet',
        label: 'Not yet'
      }
    ],
    validate: ['required']
  },
  awerb: {
    inputType: 'radioGroup',
    inline: true,
    className: 'smaller',
    options: [
      {
        value: 'Yes',
        label: 'Yes',
        reveal: [
          {
            name: 'awerb-review-date',
            inputType: 'textarea',
            label: content.fields['awerb-review-date'].label,
            validate: ['required']
          }
        ]
      },
      {
        value: 'Not yet',
        label: 'Not yet'
      }
    ],
    validate: ['required']
  },
  ready: {
    inputType: 'radioGroup',
    inline: true,
    className: 'smaller',
    options: [
      {
        value: 'Yes',
        label: 'Yes'
      },
      {
        value: 'No',
        label: 'No'
      }
    ],
    validate: ['required']
  },
  comment: {
    inputType: 'textarea',
    validate: ['required']
  }
};

const getSchema = type => {
  if (type === 'application') {
    return omit(schema, 'comment');
  }

  const amendmentSchema = omit(schema, 'ready');
  amendmentSchema.awerb.options[1] = {
    label: 'No',
    value: 'No',
    reveal: [
      {
        name: 'awerb-no-review-reason',
        label: content.fields['awerb-no-review-reason'].label,
        inputType: 'textarea',
        validate: ['required']
      }
    ]
  };

  return amendmentSchema;
};

module.exports = getSchema;
