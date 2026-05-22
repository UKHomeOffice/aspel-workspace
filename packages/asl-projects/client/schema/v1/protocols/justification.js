import { withProtocolContext } from './helpers/with-protocol-context';

export default {
  title: 'Protocol justification',
  label: 'Why is each type of animal, experimental model, and/or method selected for this protocol:',
  show: props => props.values?.isStandardProtocol !== true,
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
          type: 'texteditor'
        },
        standard: {
          type: 'paragraph'
        }
      }
    ),
    withProtocolContext(
      {
        name: 'most-refined',
        label: 'b) the most refined for the purpose?',
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
    withProtocolContext(
      {
        name: 'scientific-endpoints',
        label: 'For each model and/or method, what is the scientific need for the expected clinical signs?',
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
    withProtocolContext(
      {
        name: 'scientific-suffering',
        label: 'Why scientifically do the animals need to suffer to this degree?',
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
    withProtocolContext(
      {
        name: 'scientific-endpoints-justification',
        label: 'Why can\'t you achieve your scientific outputs with an earlier humane endpoint, or without animals showing any clinical signs?',
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
      name: 'justification-substances',
      label: 'Will you be administering substances for experimental purposes?',
      type: 'radio',
      className: 'smaller',
      inline: true,
      options: [
        {
          label: 'Yes',
          value: true,
          reveal: [
            withProtocolContext(
              {
                name: 'substances-suitibility',
                label: 'How will you assess the suitability of these substances, and minimise the unnecessary harms arising from their administration given the particular strain or type of animal you will be using?',
                hint: 'When assessing suitability, state how you will consider toxicity, efficacy, and sterility.',
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
            withProtocolContext(
              {
                name: 'dosing-regimen',
                label: 'How will you determine an appropriate dosing regimen?',
                hint: 'Include routes, dosage volumes, frequencies, and durations.',
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
