import { isTrainingLicence } from '../../../helpers';
import { withProtocolContext } from './helpers/with-protocol-context';

export default {
  title: 'Experimental design',
  granted: {
    order: 9
  },
  fields: [
    withProtocolContext(
      {
        name: 'outputs',
        show: values => !isTrainingLicence(values),
        label: 'What outputs are expected to arise from this protocol?',
        hint: 'For example, test results, phenotypic information, or products.',
        type: 'texteditor'
      },
      {
        editable: {
          label: 'What outputs are expected from this protocol?',
          hint: 'For example, test results, phenotypic information, or products',
          type: 'texteditor'
        },
        standard: {
          label: 'Permitted outputs from this protocol',
          type: 'paragraph'
        }
      }
    ),
    withProtocolContext(
      {
        name: 'training-outputs',
        show: values => isTrainingLicence(values),
        label: 'What learning outcomes are expected to arise from this protocol?',
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
        name: 'quantitative-data',
        label: 'Will this protocol generate quantitative data?',
        type: 'radio',
        className: 'smaller',
        inline: true,
        options: [
          {
            label: 'Yes',
            value: true,
            reveal: [
              {
                name: 'quantitative-data-guideline',
                label: 'Will your experimental design be determined by a regulatory guideline?',
                type: 'radio',
                className: 'smaller',
                inline: true,
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: withProtocolContext(
                      {
                        name: 'quantitative-data-guideline-refined',
                        label: 'How will you ensure that you are using the most refined methodology?',
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
                  },
                  {
                    label: 'No',
                    value: false,
                    reveal: [
                      withProtocolContext(
                        {
                          name: 'quantitative-data-pilot-studies-how',
                          label: 'Where relevant, explain how and when pilot studies will be used.',
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
                          name: 'quantitative-data-experimental-groups',
                          label: 'How will you choose different experimental groups?',
                          hint: 'For example, controls, dose levels, satellites etc.',
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
                          name: 'control-groups',
                          label: 'How will you choose control groups?',
                          hint: 'Provide a robust scientific justification for controls with significant suffering such as sham surgery controls or untreated infected controls.',
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
                          name: 'randomised',
                          label: 'How will experiments and data analysis be randomised and blinded?',
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
                          name: 'reproducibility',
                          label: 'How will you minimise variables to ensure reproducibility?',
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
                          name: 'control-groups-size',
                          label: 'How will you determine group sizes?',
                          hint: 'You should reference POWER calculations you have made, if relevant.',
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
                          name: 'maximize-effectiveness',
                          label: 'How will you maximise the data output from the animals you use on this protocol?',
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
                  }
                ]
              }
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
          label: 'Will this protocol generate quantitative data?'
        },
        standard: {
          label: 'Generation of quantitative data',
          type: 'standard-radio'
        }
      }
    )
  ]
};
