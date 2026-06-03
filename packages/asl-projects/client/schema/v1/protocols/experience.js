import { withProtocolContext } from './helpers/with-protocol-context';

export default {
  title: 'Animal experience',
  granted: {
    order: 8
  },
  fields: [
    withProtocolContext(
      {
        name: 'experience-summary',
        label: 'Summarise the typical experience or end-to-end scenario for an animal being used in this protocol.',
        hint: 'Consider the cumulative effect of any combinations of procedures that you may carry out.',
        type: 'texteditor'
      },
      {
        editable: {
          label: 'What is the typical experience or end-to-end scenario for an animal being used in this protocol?',
          hint: 'Consider the cumulative effect of any combinations of procedures that you may carry out',
          type: 'texteditor'
        },
        standard: {
          label: 'Typical experience or end-to-end scenario for an animal in this protocol',
          hint: null,
          type: 'paragraph'
        }
      }
    ),
    withProtocolContext(
      {
        name: 'experience-endpoints',
        label: 'Describe the general humane endpoints that you will apply during the protocol.',
        hint: 'These will be in addition to the endpoints stated for each step.',
        type: 'texteditor'
      },
      {
        editable: {
          label: 'Describe the general humane endpoints that you will apply during the protocol',
          hint: 'These will be in addition to the endpoints stated for each step.',
          type: 'texteditor'
        },
        standard: {
          label: 'General humane endpoints for this protocol',
          hint: 'These will be in addition to the endpoints covered in General constraints and in each step',
          type: 'paragraph'
        }
      }
    )
  ]
};
