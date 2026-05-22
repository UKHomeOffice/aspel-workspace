import { withProtocolContext } from './helpers/with-protocol-context';

export default {
  title: 'Genetically altered animals (GAA)',
  granted: {
    order: 4
  },
  fields: [
    withProtocolContext(
      {
        name: 'gaas',
        label: 'Will this protocol use any genetically altered animals?',
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
                  name: 'gaas-types',
                  label: 'Which general types or strains will you be using and why?',
                  type: 'texteditor'
                },
                {
                  editable: {
                    label: 'Which general types or strains will you be using?',
                    type: 'texteditor'
                  },
                  standard: {
                    label: 'General types or strains to be used',
                    type: 'paragraph'
                  }
                }
              ),
              withProtocolContext(
                {
                  name: 'gaas-harmful',
                  label: 'Do you expect any of these GAAs to show a harmful phenotype with welfare consequences?',
                  type: 'radio',
                  hint: null,
                  className: 'smaller',
                  inline: true,
                  options: [
                    {
                      label: 'Yes',
                      value: true,
                      reveal: [
                        withProtocolContext(
                          {
                            name: 'gaas-harmful-justification',
                            label: 'Why are each of these harmful phenotypes necessary?',
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
                            name: 'gaas-harmful-control',
                            label: 'How will you minimise the harms associated with these phenotypes?',
                            hint: 'Ensure that you include any humane endpoints that you will use.',
                            type: 'texteditor'
                          },
                          {
                            editable: {
                              label: 'How will you minimise the harms associated with these phenotypes?',
                              type: 'texteditor'
                            },
                            standard: {
                              label: 'What control measures and humane endpoints will you use to minimise suffering due to the adverse phenotypes? ',
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
                },
                {
                  editable: {
                    label: 'Do you expect any of these GA animals to show a harmful phenotype with welfare consequences?',
                    type: 'radio',
                    hint: 'If control measures prevent the harmful phenotype, you should answer ‘No’ - for example, if you are housing immunodeficient animals in a barrier environment'
                  },
                  standard: {
                    label: 'Expected harmful phenotype with welfare consequences',
                    type: 'standard-radio',
                    hint: 'If control measures prevent the harmful phenotype, you should answer ‘No’ - for example, if you are housing immunodeficient animals in a barrier environment'
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
      },
      {
        editable: {
          label: 'Will this protocol use any genetically altered animals?',
          type: 'radio'
        },
        standard: {
          label: 'Use of GA animals in this protocol',
          type: 'standard-radio'
        }
      }
    )
  ]
};
