const { omit } = require('lodash');
const { toBoolean } = require('../../../../../lib/utils');

const getDateField = establishmentName => {
  return {
    meta: true,
    inputType: 'inputDate',
    label: `Enter date of application's most recent AWERB review at ${establishmentName}`,
    // Noun-phrase for the GDS date error messages (e.g. "AWERB review date must
    // include a month"); the label itself is a full instruction, not a noun.
    dateLabel: 'AWERB review date',
    // "Enter ..." copy for the blank-date case (dynamic field, no static content).
    dateEnter: `Enter the date of the application's most recent AWERB review`,
    hint: 'For example, 12 06 2020',
    validate: [
      'required',
      'validDate',
      // ASL-5108 (Bryony 28/Jul): the AWERB review date may be the same as the
      // submission date, so allow today -> "must be today or in the past".
      { dateIsSameOrBefore: 'now' }
    ]
  };
};

const getAwerbQuestion = ({ isLegacy, canBeAwerbExempt, awerbEstablishments }) => {
  let awerbDateFields = {};
  const establishments = awerbEstablishments.filter((establishment) => !establishment.deleted);
  if (isLegacy) {
    awerbDateFields = {
      'awerb-review-date': {
        meta: true,
        inputType: 'textarea',
        validate: ['required']
      }
    };
  } else {
    awerbDateFields = establishments.reduce((fields, establishment) => {
      return {
        ...fields,
        [`awerb-${establishment.id}`]: getDateField(establishment.name)
      };
    }, {});
  }

  if (!canBeAwerbExempt) {
    return awerbDateFields;
  }

  return {
    'awerb-exempt': {
      meta: true,
      inputType: 'radioGroup',
      validate: ['required'],
      automapReveals: true,
      format: toBoolean,
      options: [
        {
          value: false,
          reveal: {
            ...awerbDateFields
          }
        },
        {
          value: true,
          reveal: {
            'awerb-no-review-reason': {
              meta: true,
              inputType: 'textarea',
              validate: ['required']
            }
          }
        }
      ]
    }
  };
};

const getSchema = ({ isLegacy, isAmendment, isAsru, includeAwerb, canBeAwerbExempt, awerbEstablishments, omitCommentsField }) => {
  let schema = {
    comments: {
      inputType: 'textarea',
      validate: ['required']
    },
    comment: {
      inputType: 'textarea',
      meta: true
    }
  };

  if (omitCommentsField) {
    delete schema.comments;
  }

  if (isAsru) {
    return schema; // no additional questions required
  }

  // awerb question should always be first if included
  if (includeAwerb) {
    schema = {
      ...getAwerbQuestion({ isLegacy, isAmendment, canBeAwerbExempt, awerbEstablishments }),
      ...schema
    };
  }

  if (isAmendment) {
    return schema;
  }

  return omit(schema, 'comments');
};

module.exports = {
  getAwerbQuestion,
  getSchema
};
