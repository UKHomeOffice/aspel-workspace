const { pick } = require('lodash');

const schema = {
  authority: {
    inputType: 'radioGroup',
    inline: true,
    className: 'smaller',
    options: [
      {
        value: 'yes',
        label: 'Yes'
      },
      {
        value: 'no',
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
        value: 'yes',
        label: 'Yes'
      },
      {
        value: 'no',
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
        value: 'yes',
        label: 'Yes'
      },
      {
        value: 'no',
        label: 'Not yet'
      }
    ],
    validate: ['required']
  },
  comment: {
    inputType: 'textarea'
  }
};

const getSchema = type => {
  return type === 'amendment'
    ? pick(schema, 'authority', 'comment')
    : pick(schema, 'authority', 'awerb', 'ready');
};

getSchema.schema = schema;

module.exports = getSchema;
