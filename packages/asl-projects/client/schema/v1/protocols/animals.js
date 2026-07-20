import { withProtocolContext } from './helpers/with-protocol-context';

export default {
  title: 'Animals used in this protocol',
  repeats: 'speciesDetails',
  hiddenFields: [],
  fields: [
    withProtocolContext(
      {
        name: 'species',
        label: 'Which types of animals would you like to add to this protocol?',
        hint: 'Select all that apply.',
        type: 'checkbox',
        className: 'smaller',
        inline: true,
        section: 'intro'
      },
      {
        editable: {
          label: 'Which types of animals would you like to add to this protocol?',
          hint: 'Select all that apply'
        },
        standard: {
          label: 'Which animal types will you be using in this protocol?',
          hint: 'Select all that apply'
        }
      }
    ),
    withProtocolContext(
      {
        name: 'maximum-animals',
        label: values => {
          return `What is the maximum number of {{ values.speciesLabel }} that will be used in this protocol?`;
        },
        hint: 'Only enter numerals, for example 40',
        type: 'text',
        inputMode: 'numeric',
        className: 'govuk-input--width-5'
      },
      {
        editable: {
          label: values => {
            return `What is the maximum number of {{ values.speciesLabel }} that will be used in this protocol?`;
          },
          hint: 'This should be a maximum and not estimated'
        },
        standard: {
          label: values => {
            return `Maximum number of {{ values.speciesLabel }} to be used`;
          },
          hint: 'This should be a maximum and not estimated'
        }
      }
    ),
    withProtocolContext(
      {
        name: 'life-stages',
        label: 'Which life stages will be used in this protocol?',
        hint: 'Select all that apply.',
        type: 'checkbox',
        className: 'smaller',
        options: [
          {
            label: 'Embryo and egg',
            value: 'embryo'
          },
          withProtocolContext(
            {
              label: 'Neonate',
              value: 'neonate',
              hint: null
            },
            {
              standard: {
                hint: 'The animal is not self-supporting - typically up to 10 days post-birth'
              }
            }
          ),
          withProtocolContext(
            {
              label: 'Juvenile',
              value: 'juvenile',
              hint: null
            },
            {
              standard: {
                hint: 'The animal is self-supporting, and is moving towards sexual maturity and adult weight'
              }
            }
          ),
          withProtocolContext(
            {
              label: 'Adult',
              value: 'adult',
              hint: null
            },
            {
              standard: {
                hint: 'The animal has reached sexual maturity and adult weight'
              }
            }
          ),
          {
            label: 'Pregnant adult',
            value: 'pregnant'
          },
          {
            label: 'Aged animal',
            value: 'aged'
          }
        ]
      },
      {
        editable: {
          label: 'Which life stages will be used in this protocol?',
          hint: 'Select all that apply.',
          type: 'checkbox'
        },
        standard: {
          label: 'Life stages permitted',
          hint: null,
          type: 'standard-list'
        }
      }
    ),
    withProtocolContext(
      {
        name: 'continued-use',
        label: 'Will any {{ values.speciesLabel }} coming onto this protocol be classed as ‘continued use’?',
        hint: '‘Continued use’ describes animals that are specifically genetically altered and bred for scientific use or animals that have had procedures applied to them in order to be prepared for use in this protocol.',
        type: 'radio',
        options: [
          {
            label: 'Yes',
            value: true,
            reveal: withProtocolContext(
              {
                name: 'continued-use-sourced',
                label: 'How did these animals start their use?',
                hint: 'Describe the procedures that have been applied to animals that will continue their use on to this protocol.',
                type: 'texteditor'
              },
              {
                editable: {
                  label: 'How did these animals start their use?',
                  hint: 'Describe the procedures that have been applied to animals that will continue their use onto this protocol.',
                  type: 'texteditor'
                },
                standard: {
                  label: 'Where these animals may be obtained from',
                  hint: null,
                  type: 'paragraph'
                }
              }
            )
          },
          {
            label: 'No',
            value: false
          }
        ],
        inline: true,
        className: 'smaller'
      },
      {
        editable: {
          label: 'Will any {{ values.speciesLabel }} coming onto this protocol be classed as ‘continued use’?',
          hint: '‘Continued use’ describes animals that are specifically genetically altered and bred for scientific use, or animals that have had procedures applied to them to prepare them for use in this protocol',
          type: 'radio'
        },
        standard: {
          label: 'Continued use coming onto the protocol',
          hint: '‘Continued use’ describes animals that are specifically genetically altered and bred for scientific use, or animals that have had procedures applied to them to prepare them for use in this protocol',
          type: 'standard-radio'
        }
      }
    ),
    withProtocolContext(
      {
        name: 'reuse',
        label: 'Are you re-using any {{ values.speciesLabel }}?',
        hint: `\
‘Re-use’ describes using an animal for a new experiment when you could equally use a naive animal to get the same results.

Select each that applies`,
        type: 'checkbox',
        preserveHierarchy: true,
        options: [
          {
            label: 'Yes, from another protocol - in this project or another project',
            value: 'other-protocol',
            reveal: [
              withProtocolContext(
                {
                  name: 'reuse-details',
                  label: 'Describe the procedures that have been applied to them and why you are choosing to re-use them',
                  type: 'texteditor'
                }
              )
            ]
          },
          {
            label: 'Yes, within this protocol',
            value: 'this-protocol',
            reveal: [
              {
                name: 'maximum-times-used',
                label: 'What is the maximum number of times an animal will be used in this protocol?',
                hint: 'Only enter numerals, for example 40',
                type: 'text',
                inputMode: 'numeric',
                className: 'govuk-input--width-5'
              }
            ]
          },
          {
            divider: 'or',
            id: 'divider'
          },
          {
            label: 'No',
            value: 'no',
            behaviour: 'exclusive'
          }
        ]
      },
      {
        editable: {
          hint: null
        },
        standard: {
          hint: null
        }
      }
    )
  ]
};
