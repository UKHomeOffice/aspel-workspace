import { getProtocolMode, isEditableStandardProtocolMode } from '../../../helpers';
import { withProtocolContext } from './helpers/with-protocol-context';

export default {
  title: 'Protocol justification',
  ...withProtocolContext(
    {
      label: 'Why is each type of animal, experimental model, and/or method selected for this protocol:'
    },
    {
      editable: {
        label: null
      },
      standard: {
        label: null
      }
    }
  ),
  show: props => getProtocolMode(props.values, props.standardProtocolsEnabled) !== 'standard',
  granted: {
    order: 10
  },
  fields: [
    withProtocolContext(
      {
        name: 'most-appropriate',
        label: 'a) the most appropriate scientific approach?',
        type: 'texteditor'
      },
      {
        editable: {
          type: 'textarea',
          label: 'In what ways have you changed the standard protocol and why?'
        }
      }
    ),
    {
      name: 'most-refined',
      show: values => !isEditableStandardProtocolMode(values),
      label: 'b) the most refined for the purpose?',
      type: 'texteditor'
    },
    {
      name: 'scientific-endpoints',
      show: values => !isEditableStandardProtocolMode(values),
      label: 'For each model and/or method, what is the scientific need for the expected clinical signs?',
      type: 'texteditor'
    },
    {
      name: 'scientific-suffering',
      show: values => !isEditableStandardProtocolMode(values),
      label: 'Why scientifically do the animals need to suffer to this degree?',
      type: 'texteditor'
    },
    {
      name: 'scientific-endpoints-justification',
      show: values => !isEditableStandardProtocolMode(values),
      label: 'Why can\'t you achieve your scientific outputs with an earlier humane endpoint, or without animals showing any clinical signs?',
      type: 'texteditor'
    },
    {
      name: 'justification-substances',
      show: values => !isEditableStandardProtocolMode(values),
      label: 'Will you be administering substances for experimental purposes?',
      type: 'radio',
      className: 'smaller',
      inline: true,
      options: [
        {
          label: 'Yes',
          value: true,
          reveal: [
            {
              name: 'substances-suitibility',
              label: 'How will you assess the suitability of these substances, and minimise the unnecessary harms arising from their administration given the particular strain or type of animal you will be using?',
              hint: 'When assessing suitability, state how you will consider toxicity, efficacy, and sterility.',
              type: 'texteditor'
            },
            {
              name: 'dosing-regimen',
              label: 'How will you determine an appropriate dosing regimen?',
              hint: 'Include routes, dosage volumes, frequencies, and durations.',
              type: 'texteditor'
            }
          ]
        },
        {
          label: 'No',
          value: false
        }
      ]
    }
  ]
};
