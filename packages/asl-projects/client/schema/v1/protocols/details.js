import { isTrainingLicence } from '../../../helpers';
import { withProtocolContext } from './helpers/with-protocol-context';

export default [
  withProtocolContext(
    {
      name: 'description',
      label: 'Briefly describe the purposes of this protocol',
      hint: 'Ensure that you state any relevant regulatory guidelines.',
      type: 'texteditor'
    },
    {
      editable: {
        label: 'What are the purposes of this protocol?',
        hint: 'Ensure that you state any relevant regulatory guidelines.',
        type: 'texteditor'
      },
      standard: {
        label: 'Purposes of protocol',
        hint: null,
        type: 'paragraph'
      }
    }
  ),
  withProtocolContext(
    {
      name: 'severity',
      label: 'Given the controls and limitations in place, what is the highest severity that an animal could experience in this protocol?',
      hint: null,
      type: 'radio',
      options: [
        {
          label: 'Mild',
          value: 'mild'
        },
        {
          label: 'Moderate',
          value: 'moderate'
        },
        {
          label: 'Severe',
          value: 'severe'
        },
        {
          label: 'Non-recovery',
          value: 'non-recovery'
        }
      ],
      className: 'smaller'
    },
    {
      editable: {
        label: 'What is the highest level of suffering an animal could experience in this protocol?',
        hint: 'This determines the severity category for the protocol',
        type: 'radio'
      },
      standard: {
        label: 'Highest level of suffering an animal could experience in this protocol',
        hint: 'This determines the severity category for the protocol',
        type: 'standard-radio'
      }
    }
  ),
  withProtocolContext(
    {
      name: 'severity-proportion',
      label: 'What proportion of animals will experience this severity?',
      type: 'texteditor'
    },
    {
      editable: {
        label: 'What proportion of animals could experience this level of suffering?',
        type: 'texteditor'
      },
      standard: {
        label: 'Proportion of animals that could experience this level of suffering',
        type: 'paragraph'
      }
    }
  ),
  withProtocolContext(
    {
      name: 'severity-details',
      label: 'Why are you proposing this severity category?',
      type: 'texteditor'
    },
    {
      editable: {
        label: 'What is the reason for this level of suffering?',
        type: 'texteditor'
      },
      standard: {
        label: 'Reason for level of suffering',
        type: 'paragraph'
      }
    }
  ),
  withProtocolContext(
    {
      name: 'locations',
      label: 'Select the establishments and POLEs where this protocol will be carried out.',
      review: 'Locations where this protocol can be carried out',
      hint: 'Select all that apply.',
      type: 'location-selector'
    },
    {
      editable: {
        label: 'Where will you carry out this protocol?',
        hint: 'Select all that apply'
      },
      standard: {
        label: 'Where will you carry out this protocol?',
        hint: 'Select all that apply'
      }
    }
  ),
  withProtocolContext(
    {
      name: 'objectives',
      label: 'Which of your objectives will this protocol address?',
      hint: 'Select all that apply.',
      type: 'objective-selector'
    },
    {
      editable: {
        label: 'Which objectives will this protocol address?',
        hint: 'Select all that apply'
      },
      standard: {
        label: 'Which objectives will this protocol address?',
        hint: 'Select all that apply'
      }
    }
  ),
  {
    name: 'training-used-for',
    show: values => values?.isStandardProtocol !== true &&
      isTrainingLicence(values),
    label: 'What will this protocol be used for?',
    hint: 'If your purpose isn’t listed you can leave this blank.',
    type: 'checkbox',
    className: 'smaller',
    options: [
      {
        label: 'Demonstration purposes',
        value: 'demonstration'
      },
      {
        label: 'Tissue provision',
        value: 'tissue-provision'
      }
    ]
  },
  withProtocolContext(
    {
      name: 'training-responsible-for-animals',
      show: values => values?.isStandardProtocol !== true &&
        isTrainingLicence(values),
      label: 'Who will be responsible for the animals used in this protocol?',
      type: 'texteditor'
    },
    {
      editable: {
        type: 'texteditor'
      },
      standard: {
        type: 'paragraph'
      }
    }
  ),
  {
    name: 'training-regulated-procedures',
    show: values => values?.isStandardProtocol !== true &&
      isTrainingLicence(values),
    label: 'Will students carry out regulated procedures under this protocol?',
    type: 'radio',
    className: 'smaller',
    options: [
      {
        label: 'Yes',
        value: true,
        reveal: {
          name: 'training-regulated-procedures-type-of-pil',
          label: 'What type of personal licence will they need?',
          type: 'radio',
          options: [
            {
              label: 'A and B',
              value: 'A, B'
            },
            {
              label: 'A, B and C',
              value: 'A, B, C'
            },
            {
              label: 'E',
              value: 'E'
            }
          ]
        }
      },
      {
        label: 'No',
        value: false
      }
    ],
    inline: true
  },
  withProtocolContext(
    {
      name: 'training-participant-pre-course-training',
      show: values => values?.isStandardProtocol !== true &&
        isTrainingLicence(values),
      label: 'What training will participants receive before they can use protected animals?',
      type: 'texteditor'
    },
    {
      editable: {
        type: 'texteditor'
      },
      standard: {
        type: 'paragraph'
      }
    }
  )
];


