import GrantedProtocols from '../../pages/sections/granted/protocols';
import Protocols from '../../pages/sections/protocols';
import ProtocolsReview from '../../pages/sections/protocols/review';
import { getCurrentURLForFateOfAnimals, isTrainingLicence, markdownLink } from '../../helpers';
import Purpose from '../../pages/sections/granted/protocol-purpose';
import ProtocolEstablishments from '../../pages/sections/granted/protocol-establishments';
import ProtocolObjectives from '../../pages/sections/granted/protocol-objectives';
import GrantedSteps from '../../pages/sections/granted/protocol-steps';
import NTSFateOfAnimalFields from '../../helpers/nts-field';

export default () => ({
protocols: {
  title: 'Protocols',
    subsections: {
    protocols: {
      title: 'Protocols',
        granted: {
        review: GrantedProtocols,
          order: 4
      },
      name: 'protocols',
        component: Protocols,
        review: ProtocolsReview,
        repeats: 'protocols',
        fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text'
        }
      ],
        sections: {
        details: {
          title: 'Protocol details',
            fields: [
            {
              name: 'description',
              label: 'Briefly describe the purposes of this protocol',
              hint: 'Ensure that you state any relevant regulatory guidelines.',
              type: isStandardProtocol ? 'text' : 'texteditor'
            },
            {
              name: 'severity',
              label: 'Given the controls and limitations in place, what is the highest severity that an animal could experience in this protocol?',
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
              name: 'severity-proportion',
              label: 'What proportion of animals will experience this severity?',
              type: 'texteditor'
            },
            {
              name: 'severity-details',
              label: 'Why are you proposing this severity category?',
              type: 'texteditor'
            },
            {
              name: 'locations',
              label: 'Select the establishments and POLEs where this protocol will be carried out.',
              review: 'Locations where this protocol can be carried out',
              hint: 'Select all that apply.',
              type: 'location-selector'
            },
            {
              name: 'objectives',
              label: 'Which of your objectives will this protocol address?',
              hint: 'Select all that apply.',
              type: 'objective-selector'
            },
            {
              name: 'training-used-for',
              show: values => isTrainingLicence(values),
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
            {
              name: 'training-responsible-for-animals',
              show: values => isTrainingLicence(values),
              label: 'Who will be responsible for the animals used in this protocol?',
              type: 'texteditor'
            },
            {
              name: 'training-regulated-procedures',
              show: values => isTrainingLicence(values),
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
            {
              name: 'training-participant-pre-course-training',
              show: values => isTrainingLicence(values),
              label: 'What training will participants receive before they can use protected animals?',
              type: 'texteditor'
            }
          ]
        },
        purpose: {
          title: 'Purpose and outputs',
            show: props => props.isGranted && !props.isFullApplication,
            granted: {
            order: 2,
              review: Purpose
          }
        },
        establishments: {
          title: 'Establishments and POLEs',
            show: props => props.isGranted && !props.isFullApplication,
            granted: {
            order: 3,
              review: ProtocolEstablishments
          }
        },
        animals: {
          title: 'Animals used in this protocol',
            repeats: 'speciesDetails',
            hiddenFields: [],
            fields: [
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
              name: 'maximum-animals',
              label: 'What is the maximum number of {{ values.speciesLabel }} that will be used in this protocol?',
              hint: 'Only enter numerals, for example 40',
              type: 'text',
              inputMode: 'numeric',
              className: 'govuk-input--width-5'
            },
            {
              name: 'life-stages',
              label: 'Which life stages will be used in this protocol?',
              hint: 'Select all that apply',
              type: 'checkbox',
              className: 'smaller',
              options: [
                {
                  label: 'Embryo and egg',
                  value: 'embryo'
                },
                {
                  label: 'Neonate',
                  value: 'neonate'
                },
                {
                  label: 'Juvenile',
                  value: 'juvenile'
                },
                {
                  label: 'Adult',
                  value: 'adult'
                },
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
              name: 'continued-use',
              label: 'Will any {{ values.speciesLabel }} coming onto this protocol be classed as ‘continued use’?',
              hint: '‘Continued use’ describes animals that are specifically genetically altered and bred for scientific use or animals that have had procedures applied to them in order to be prepared for use in this protocol.',
              type: 'radio',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: {
                    name: 'continued-use-sourced',
                    label: 'How did these animals start their use?',
                    hint: 'Describe the procedures that have been applied to animals that will continue their use on to this protocol.',
                    type: 'texteditor'
                  }
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
                    {
                      name: 'reuse-details',
                      label: 'Describe the procedures that have been applied to them and why you are choosing to re-use them',
                      type: 'texteditor'
                    }
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
              ],
            },
          ]
        },
        gaas: {
          title: 'Genetically altered animals (GAA)',
            granted: {
            order: 4
          },
          fields: [
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
                    {
                      name: 'gaas-types',
                      label: 'Which general types or strains will you be using and why?',
                      type: 'texteditor'
                    },
                    {
                      name: 'gaas-harmful',
                      label: 'Do you expect any of these GAAs to show a harmful phenotype with welfare consequences?',
                      type: 'radio',
                      className: 'smaller',
                      inline: true,
                      options: [
                        {
                          label: 'Yes',
                          value: true,
                          reveal: [
                            {
                              name: 'gaas-harmful-justification',
                              label: 'Why are each of these harmful phenotypes necessary?',
                              type: 'texteditor'
                            },
                            {
                              name: 'gaas-harmful-control',
                              label: 'How will you minimise the harms associated with these phenotypes?',
                              hint: 'Ensure that you include any humane endpoints that you will use.',
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
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            }
          ]
        },
        objectives: {
          title: 'Objectives',
            show: props => props.isGranted && !props.isFullApplication,
            granted: {
            order: 6,
              review: ProtocolObjectives
          }
        },
        steps: {
          title: 'Steps',
            hint: 'A step can be a single procedure or a combination of procedures to achieve an outcome. You will be able to reorder your steps at any time before you send your application to the Home Office, but they should be broadly chronological, with the final step being a method of killing or the last regulated procedure.',
            footer: 'Once you’ve created a list of steps, you need to add information about adverse effects, controls and limitations, and humane endpoints to each one.',
            repeats: 'steps',
            granted: {
            order: 7,
              review: GrantedSteps
          },
          fields: [
            {
              name: 'title',
              type: 'texteditor',
              label: 'Describe the procedures that will be carried out during this step.',
              hint: 'Explain where one or more steps are repeated in one experiment, list any alternative techniques within a step (e.g. dosing routes), and include all procedures performed under terminal anaesthesia.\n\nWhen describing the technical aspects of a step, be broad enough to be flexible when the variation does not impact on animal welfare (e.g. use "antibiotic" instead of "penicillin"). Finally, avoid specifying volumes and frequencies when they do not impact on animal welfare.'
            },
            {
              name: 'reference',
              type: 'text',
              label: 'Step reference',
              hint: 'Provide a short reference for this step, e.g. \'Blood sampling\' or \'Transgene induction\'',
              show: props => {
                return !props.readonly;
              }
            },
            {
              name: 'optional',
              label: 'Is this step optional?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true
                },
                {
                  label: 'No',
                  value: false
                }
              ]
            },
            {
              name: 'adverse',
              label: 'Do you expect this step to have adverse effects for the animals that are more than mild and transient?',
              hint: 'Do not list uncommon or unlikely adverse effects, or effects from procedures that will cause no more than transient discomfort and no lasting harm. For example, an intravenous injection of a small volume of an innocuous substance.',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true,
                  reveal: [
                    {
                      name: 'adverse-effects',
                      label: 'What are the likely adverse effects of this step?',
                      hint: 'State the expected adverse effect, including the likely incidence, and the anticipated degree and duration of suffering.',
                      type: 'texteditor'
                    },
                    {
                      name: 'prevent-adverse-effects',
                      label: 'How will you monitor for, control, and limit any of these adverse effects?',
                      hint: 'If adverse effects can\'t be prevented, how will you attempt to ameliorate their initial signs?',
                      type: 'texteditor'
                    },
                    {
                      name: 'endpoints',
                      label: 'What are the humane endpoints for this step?',
                      hint: 'This would be the point at which you would kill the animal to prevent further suffering.',
                      type: 'texteditor'
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
              name: 'reusable',
              label: 'Do you want to be able to use this step on other protocols?',
              type: 'radio',
              inline: true,
              className: 'smaller',
              options: [
                {
                  label: 'Yes',
                  value: true
                },
                {
                  label: 'No',
                  value: false
                }
              ],
              show: props => !props.readonly
            }
          ]
        },
        fate: {
          title: 'Fate of animals',
            show: ({ isGranted, isFullApplication }) => !isGranted || isFullApplication,
            granted: {
            order: 11
          },
          fields: [
            {
              name: 'fate',
              label: 'What will happen to animals at the end of this protocol?',
              hint: `Select all that apply. These options are based on what you selected in the ${markdownLink('non-technical summary', getCurrentURLForFateOfAnimals())}.`,
              type: 'checkbox',
              preserveHierarchy: true,
              className: 'smaller',
              options: Object.values(NTSFateOfAnimalFields())
            }
          ]
        },
        experience: {
          title: 'Animal experience',
            granted: {
            order: 8
          },
          fields: [
            {
              name: 'experience-summary',
              label: 'Summarise the typical experience or end-to-end scenario for an animal being used in this protocol.',
              hint: 'Consider the cumulative effect of any combinations of procedures that you may carry out.',
              type: 'texteditor'
            },
            {
              name: 'experience-endpoints',
              label: 'Describe the general humane endpoints that you will apply during the protocol.',
              hint: 'These will be in addition to the endpoints stated for each step.',
              type: 'texteditor'
            }
          ]
        },
        experimentalDesign: {
          title: 'Experimental design',
            granted: {
            order: 9
          },
          fields: [
            {
              name: 'outputs',
              show: values => !isTrainingLicence(values),
              label: 'What outputs are expected to arise from this protocol?',
              hint: 'For example, test results, phenotypic information, or products.',
              type: 'texteditor'
            },
            {
              name: 'training-outputs',
              show: values => isTrainingLicence(values),
              label: 'What learning outcomes are expected to arise from this protocol?',
              type: 'texteditor'
            },
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
                          reveal: {
                            name: 'quantitative-data-guideline-refined',
                            label: 'How will you ensure that you are using the most refined methodology?',
                            type: 'texteditor'
                          }
                        },
                        {
                          label: 'No',
                          value: false,
                          reveal: [
                            {
                              name: 'quantitative-data-pilot-studies-how',
                              label: 'Where relevant, explain how and when pilot studies will be used.',
                              type: 'texteditor'
                            },
                            {
                              name: 'quantitative-data-experimental-groups',
                              label: 'How will you choose different experimental groups?',
                              hint: 'For example, controls, dose levels, satellites etc.',
                              type: 'texteditor'
                            },
                            {
                              name: 'control-groups',
                              label: 'How will you choose control groups?',
                              hint: 'Provide a robust scientific justification for controls with significant suffering such as sham surgery controls or untreated infected controls.',
                              type: 'texteditor'
                            },
                            {
                              name: 'randomised',
                              label: 'How will experiments and data analysis be randomised and blinded?',
                              type: 'texteditor'
                            },
                            {
                              name: 'reproducibility',
                              label: 'How will you minimise variables to ensure reproducibility?',
                              type: 'texteditor'
                            },
                            {
                              name: 'control-groups-size',
                              label: 'How will you determine group sizes?',
                              hint: 'You should reference POWER calculations you have made, if relevant.',
                              type: 'texteditor'
                            },
                            {
                              name: 'maximize-effectiveness',
                              label: 'How will you maximise the data output from the animals you use on this protocol?',
                              type: 'texteditor'
                            }
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
            }
          ]
        },
        justification: {
          title: 'Protocol justification',
            label: 'Why is each type of animal, experimental model, and/or method selected for this protocol:',
            granted: {
            order: 10
          },
          fields: [
            {
              name: 'most-appropriate',
              label: 'a) the most appropriate scientific approach?',
              type: 'texteditor'
            },
            {
              name: 'most-refined',
              label: 'b) the most refined for the purpose?',
              type: 'texteditor'
            },
            {
              name: 'scientific-endpoints',
              label: 'For each model and/or method, what is the scientific need for the expected clinical signs?',
              type: 'texteditor'
            },
            {
              name: 'scientific-suffering',
              label: 'Why scientifically do the animals need to suffer to this degree?',
              type: 'texteditor'
            },
            {
              name: 'scientific-endpoints-justification',
              label: 'Why can\'t you achieve your scientific outputs with an earlier humane endpoint, or without animals showing any clinical signs?',
              type: 'texteditor'
            },
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
        },
        conditions: {
          title: 'Additional conditions',
            show: props => props.showConditions,
            singular: 'Additional condition',
            items: 'Additional conditions',
            granted: {
            order: 0
          }
        },
        authorisations: {
          title: 'Authorisations',
            show: props => props.showConditions,
            singular: 'Authorisation',
            items: 'Authorisations',
            granted: {
            order: 1
          }
        }
      }
    }
  }
}
});
