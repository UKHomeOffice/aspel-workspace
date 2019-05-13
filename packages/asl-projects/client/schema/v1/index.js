import NTSSummary from '../../pages/sections/nts';
import Protocols from '../../pages/sections/protocols';
import ProtocolsReview from '../../pages/sections/protocols/review';
import Objectives from '../../pages/sections/objectives';
import ObjectivesReview from '../../pages/sections/objectives/review';
import Establishments from '../../pages/sections/establishments';
import EstablishmentsReview from '../../pages/sections/establishments/review';
import Poles from '../../pages/sections/poles';
import PolesReview from '../../pages/sections/poles/review';
import Conditions from '../../pages/sections/conditions';

import SPECIES from '../../constants/species';

import intersection from 'lodash/intersection';
import some from 'lodash/some';
import flatten from 'lodash/flatten';

export default {
  introduction: {
    title: 'Project introduction',
    subsections: {
      introduction: {
        title: 'Introductory details',
        nts: true,
        fields: [
          {
            name: 'title',
            label: 'What\'s the title of this project?',
            type: 'text'
          },
          {
            name: 'project-aim',
            label: 'What\'s the aim of this project?',
            hint: 'Keep this to a short one or two sentence summary.',
            playback: 'Aim of this project',
            type: 'texteditor'
          },
          {
            name: 'project-importance',
            label: 'Why is it important to undertake this work?',
            type: 'texteditor'
          },
          {
            name: 'permissible-purpose',
            label: 'Which permissible purposes apply to this project?',
            type: 'checkbox',
            className: 'smaller',
            options: [
              {
                label: '(a) Basic research',
                value: 'basic-research'
              },
              {
                label: '(b) Translational or applied research with one of the following aims:',
                value: 'translational-research',
                reveal: {
                  name: 'translational-research',
                  label: '',
                  type: 'checkbox',
                  className: 'smaller',
                  options: [
                    {
                      label: '(i) Avoidance, prevention, diagnosis or treatment of disease, ill-health  or abnormality, or their effects, in man, animals or plants',
                      value: 'translational-research-1',
                    },
                    {
                      label: '(ii) Assessment, detection, regulation or modification of physiological conditions in man, animals or plants',
                      value: 'translational-research-2'
                    },
                    {
                      label: '(iii) Improvement of the welfare of animals or of the production conditions for animals reared for agricultural purposes',
                      value: 'translational-research-3'
                    }
                  ]
                }
              },
              {
                label: '(c) Development, manufacture or testing of the quality, effectiveness and safety of drugs, foodstuffs and feedstuffs or any other substances or products, with one of the following aims mentioned in paragraph (b)',
                value: 'safety-of-drugs'
              },
              {
                label: '(d) Protection of the natural environment in the interests of the health or welfare of man or animals',
                value: 'protection-of-environment'
              },
              {
                label: '(e) Research aimed at preserving the species of animal subjected to regulated procedures as part of the programme of work',
                value: 'preservation-of-species'
              },
              {
                label: '(f) Higher education or training for the acquisition, maintenance or improvement of vocational skills',
                value: 'higher-education'
              },
              {
                label: '(g) Forensic enquiries',
                value: 'forensic-enquiries'
              }
            ]
          },
          {
            name: 'duration',
            label: 'What will be the duration of this project?',
            type: 'duration'
          },
          {
            name: 'species',
            label: 'Which types of animals will be used in this project?',
            type: 'species-selector',
            summary: true
          }
        ]
      }
    }
  },
  applicantInformation: {
    title: 'Applicant information',
    subsections: {
      experience: {
        title: 'Experience',
        fields: [
          {
            name: 'experience-projects',
            label: 'Have you managed similar work in this field before?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: {
                  name: 'experience-achievements',
                  label: 'What were your, or your group\'s, main achievements that are relevant to this application?',
                  type: 'texteditor'
                }
              },
              {
                label: 'No',
                value: false,
                reveal: [
                  {
                    name: 'experience-knowledge',
                    label: 'What relevant scientific knowledge or education do you have?',
                    type: 'texteditor'
                  },
                  {
                    name: 'experience-animals',
                    label: 'What experience do you have of using the types of animals and experimental models stated in this licence application?',
                    type: 'texteditor'
                  },
                  {
                    name: 'experience-experimental-design',
                    label: 'What experimental design and data analysis training have you had?',
                    hint: 'If you do not have this expertise, how will you access it?',
                    type: 'texteditor'
                  },
                  {
                    name: 'experience-others',
                    label: 'Why are you the most suitable person in the research group, department or company to manage the project?',
                    type: 'texteditor'
                  }
                ]
              }
            ]
          },
          {
            name: 'funding-previous',
            label: 'What relevant expertise and staffing will be available to help you to deliver the programme of work?',
            hint: 'Include examples of practical, technical, and specialist support.',
            type: 'texteditor'
          },
          {
            name: 'other-people',
            label: 'Will other people help you manage the project? If so, how?',
            type: 'texteditor'
          }
        ]
      },
      funding: {
        title: 'Funding',
        fields: [
          {
            name: 'funding-how',
            label: 'How do you plan to fund your work?',
            hint: 'If you do not have full funding, explain how you will stage your work and the likelihood of you obtaining further funding.',
            type: 'texteditor'
          },
          {
            name: 'funding-basic-translational',
            label: 'Will this work support basic or translational research, or non-regulatory drug or device development?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: {
                  name: 'funding-reviewed',
                  label: 'Were any grant applications for this work peer reviewed? If so, by whom?',
                  type: 'texteditor'
                }
              },
              {
                label: 'No',
                value: false
              }
            ]
          }
        ]
      }
    }
  },
  projectLocation: {
    title: 'Project location',
    subsections: {
      establishments: {
        title: 'Establishments',
        review: EstablishmentsReview,
        repeats: 'establishments',
        steps: [
          {
            fields: [
              {
                name: 'other-establishments',
                label: 'Will your project use any additional establishments?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'other-establishments-list',
                      label: '',
                      type: 'checkbox',
                      className: 'smaller',
                      optionsFromSettings: 'establishments'
                    }
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
            show: values => values['other-establishments'] === true && values['other-establishments-list'] && values['other-establishments-list'].length,
            component: Establishments,
            name: 'establishments',
            repeats: true,
            fields: [
              {
                name: 'establishment-about',
                label: 'Why do you need to carry out work at this establishment?',
                hint: 'For example, there may be important specialised equipment at this location that is not available at your primary establishment.',
                type: 'texteditor',
                repeats: true
              },
              {
                name: 'establishment-supervisor',
                label: 'Who will be responsible for supervising your work at this establishment?',
                type: 'texteditor',
                repeats: true
              }
            ]
          },
          {
            fields: [
              {
                name: 'establishments-care-conditions',
                label: 'Do the housing, husbandry, and care conditions at each establishment meet the requirements laid out in the Code of Practice for each type of animal you will be using?',
                hint: 'Please read the Code of Practice for the housing and care of animals bred, supplied, or used for scientific purposes before you answer.',
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
                    value: false,
                    reveal: {
                      name: 'establishments-care-conditions-justification',
                      label: 'If any establishment does not meet these requirements, or if any type of animal you\'re using is not listed in the Code of Practice, explain how you will ensure that housing, husbandry, and care conditions are appropriate for your project.',
                      type: 'texteditor'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      'transfer-of-animals': {
        title: 'Transfer and movement of animals',
        show: values => values['other-establishments'] && values['other-establishments-list'] && values['other-establishments-list'].length,
        fields: [
          {
            name: 'transfer',
            label: 'Will any animals be moved between licensed establishments during this project?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'transfer-why',
                    label: 'Why do you need to move animals between licensed establishments?',
                    type: 'texteditor'
                  },
                  {
                    name: 'transfer-how',
                    label: 'How might the movement of animals between licensed establishments affect scientific delivery of the work?',
                    type: 'texteditor'
                  },
                  {
                    name: 'transfer-measures',
                    label: 'What measures will you use to minimise any adverse effects for animals that may arise when moving them between licensed establishments?',
                    type: 'texteditor'
                  },
                  {
                    name: 'transfer-recovery',
                    label: 'Will surgically prepared animals be given a minimum of 7 days to recover before being transferred?',
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
                        value: false,
                        reveal: {
                          name: 'transfer-no-recovery',
                          label: 'Why won\'t animals be given 7 days to recover before being transferred?',
                          type: 'texteditor'
                        }
                      }
                    ]
                  },
                  {
                    name: 'transfer-acclimatisation',
                    label: 'Will animals be given a minimum of 7 days to acclimatise to their new surroundings prior to any regulated procedures being undertaken?',
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
                        value: false,
                        reveal: {
                          name: 'transfer-no-acclimatisation',
                          label: 'Why won\'t  animals be given 7 days to acclimatise to their new surroundings? ',
                          type: 'texteditor'
                        }
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
      poles: {
        title: 'Places other than a licensed establishment (POLEs)',
        review: PolesReview,
        repeats: 'polesList',
        steps: [
          {
            fields: [
              {
                name: 'poles',
                label: 'Will any part of your project be carried out in any places other than a licensed establishment (POLEs)?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'poles-justification',
                      label: 'Why can\'t this part of your project take place at a licensed establishment?',
                      type: 'texteditor'
                    }
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
            component: Poles,
            show: values => values.poles === true,
            name: 'polesList',
            repeats: true,
            fields: [
              {
                name: 'title',
                label: 'Name',
                type: 'text'
              },
              {
                name: 'pole-info',
                label: 'Details',
                type: 'texteditor'
              }
            ]
          },
          {
            show: values => values.poles === true,
            fields: [
              {
                name: 'poles-inspection',
                label: 'How will you ensure that procedures taking place at these POLEs can be inspected?',
                hint: 'For example, how will you obtain consent from landowners?',
                type: 'texteditor'
              },
              {
                name: 'poles-transfer',
                label: 'Will any animals be moved between a POLE and a licensed establishment during this project?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'poles-transfer-justification',
                        label: 'Why do you need to move animals between a POLE and a licensed establishment?',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-delivery',
                        label: 'How might the movement of animals between a POLE and a licensed establishment affect the scientific delivery of this project?',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-condition',
                        label: 'How will you ensure that animals are in a suitable condition to be transported?',
                        hint: 'Include all checks that will be made for suitability and what will happen to animals that are not suitable to be transported.',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-responsibility',
                        label: 'Who will be responsible for checking the animals before they are transported?',
                        hint: 'This does not need to be a Named Veterinary Surgeon.',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-checks',
                        label: 'How will you ensure that this person is competent to make the appropriate checks?',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-measures',
                        label: 'What arrangements will be made to assure an animal\'s welfare during transport, particularly if they are being moved after the start of regulated procedures?',
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
          }
        ]
      }
    }
  },
  projectPlan: {
    title: 'Project plan',
    subsections: {
      'scientific-background': {
        title: 'Scientific background',
        fields: [
          {
            name: 'scientific-background-basic-translational',
            label: 'Will this work support basic or translational research, or non-regulatory drug or device development?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'scientific-knowledge-summary',
                    label: 'Briefly summarise the current state of scientific knowledge in this area of work to show how you arrived at the starting point of this project.',
                    hint: 'Be specific and relevant to your project aim - there\'s no need for a detailed overview of the entire field. Include any relevant non-animal research if it has contributed to the starting point of your project.',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-knowledge-details',
                    label: 'What new knowledge do you hope to discover that will address a gap in fundamental scientific knowledge or meet a clinical need?',
                    hint: 'Refer to the basis for any scientific hypotheses you plan to test during this project.',
                    type: 'texteditor'
                  },
                  {
                    name: 'clinical-condition',
                    label: 'Does your project mainly involve translational or veterinary clinical applications?',
                    type: 'radio',
                    inline: true,
                    className: 'smaller',
                    options: [
                      {
                        label: 'Yes',
                        value: true,
                        reveal: [
                          {
                            name: 'condition-severity',
                            label: 'How prevalent and severe are the relevant clinical conditions?',
                            type: 'texteditor'
                          },
                          {
                            name: 'condition-treatments-problems',
                            label: 'What are the problems with current treatments which mean that further work is necessary?',
                            type: 'texteditor'
                          },
                          {
                            name: 'condition-scientific-approach',
                            label: 'What is the scientific basis for your proposed approach?',
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
          },
          {
            name: 'scientific-background-producing-data',
            label: 'Will you be producing data primarily for regulatory authorities that use standardised protocol frameworks?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'scientific-background-producing-data-substances',
                    label: 'What substances or devices will undergo regulatory testing?',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-producing-data-service',
                    label: 'Will this testing be offered as a service to others?',
                    type: 'radio',
                    inline: true,
                    className: 'smaller',
                    options: [
                      {
                        label: 'Yes',
                        value: true,
                        reveal: [
                          {
                            name: 'scientific-background-producing-data-service-nature',
                            label: 'What is the nature of the service you wish to provide?',
                            type: 'texteditor'
                          },
                          {
                            name: 'scientific-background-producing-data-service-who',
                            label: 'Who will you provide the service to?',
                            type: 'texteditor'
                          },
                          {
                            name: 'scientific-background-producing-data-service-how',
                            label: 'In general terms, how will those using your service use the data that your produce?',
                            type: 'texteditor'
                          },
                          {
                            name: 'scientific-background-producing-data-service-what',
                            label: 'What are the likely demands for the service over the lifetime of the project?',
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
          },
          {
            name: 'scientific-background-non-regulatory',
            label: 'Will you be undertaking non-regulatory testing or screening as a service to others?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'scientific-background-non-regulatory-what',
                    label: 'What service do you wish to provide?',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-non-regulatory-who',
                    label: 'Who will you provide the service to?',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-non-regulatory-how',
                    label: 'In general terms, how will your clients use the data or other outputs that you produce?',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-non-regulatory-select',
                    label: 'How will you select the most appropriate scientific model or method?',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-non-regulatory-demands',
                    label: 'What are the likely demands for the service over the lifetime of the project?',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-non-regulatory-condition',
                    label: 'Does this project relate directly to a clinical condition?',
                    type: 'radio',
                    inline: true,
                    className: 'smaller',
                    options: [
                      {
                        label: 'Yes',
                        value: true,
                        reveal: [
                          {
                            name: 'scientific-background-non-regulatory-condition-severe',
                            label: 'How prevalent and severe are the relevant clinical conditions?',
                            type: 'texteditor'
                          },
                          {
                            name: 'scientific-background-non-regulatory-condition-problems',
                            label: 'What are the problems with current treatments which mean that further work is necessary?',
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
          },
          {
            name: 'scientific-background-genetically-altered',
            label: 'Will you be producing genetically altered or surgically prepared animals/animal products using standardised protocol frameworks as a service to others?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'scientific-background-genetically-altered-producs',
                    label: 'What products do you wish to provide?',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-genetically-altered-service',
                    label: 'Who will you provide a service to?',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-genetically-altered-how',
                    label: 'In general terms, how will those using your service use the product?',
                    hint: 'This can include advancing scientific knowledge, or to benefit humans, animals, or the environment.',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-genetically-altered-what',
                    label: 'What are the likely demands for the products over the lifetime of the project?',
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
            name: 'scientific-background-vaccines',
            label: 'Will you be manufacturing vaccines and medicines for medical or veterinary use?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'scientific-background-vaccines-how',
                    label: 'How will these products benefit human health, animal health, or the environment?',
                    type: 'texteditor'
                  },
                  {
                    name: 'scientific-background-vaccines-what',
                    label: 'What are the likely demands for the products over the lifetime of the project?',
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
            name: 'transfer-expiring',
            label: 'Do you need to transfer animals from an expiring licence as continued use?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'expiring-yes',
                    label: 'Please state the licence number and expiry date of all these licences.',
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
      'action-plan': {
        title: 'Action plan',
        playback: 'project-aim',
        repeats: 'objectives',
        review: ObjectivesReview,
        steps: [
          {
            name: 'objectives',
            title: 'Action plan - 1 of 2',
            intro: 'There are several useful resources to help you plan your experiments. It is recommended that you read the ARRIVE or PREPARE guidelines, or use the NC3Rs\' Experimental Design Assistant before answering the questions in this section.',
            component: Objectives,
            repeat: 'objectives',
            repeats: true,
            fields: [
              {
                name: 'title',
                label: 'Title',
                type: 'text',
                objective: true
              },
              {
                name: 'objective-relation',
                label: 'How do each of these objectives relate to each other and help you to achieve your aim?',
                hint: `Outline any interdependencies, stop:go points, and milestones. Include any key in vitro, ex vivo or in silico work, clinical findings, or results from epidemiological studies carried out under other projects that will enable you to achieve your objectives.

Consider including images (.jpg and .png files) of annotated flow charts
and decision trees in your action plan to illustrate how objectives relate to
each other.`,
                type: 'texteditor'
              }
            ]
          },
          {
            title: 'Action plan - 2 of 2',
            fields: [
              {
                name: 'objectives-alternatives',
                label: 'Where relevant, how will you seek to use or develop non-animal alternatives for all or part of your work?',
                type: 'texteditor'
              },
              {
                name: 'objectives-regulatory-authorities',
                label: 'Will you be producing data primarily for regulatory authorities that use standardised protocol frameworks?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'objectives-regulatory-authorities-tests',
                        label: 'What tests will be performed for regulatory purposes?',
                        hint: 'State under which guidelines, and for which regulators.',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-regulatory-authorities-in-vivo',
                        label: 'How have you determined that an in vivo test is required by the regulator and that non-animal alternatives cannot be used?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-regulatory-authorities-how',
                        label: 'How will you deal with requests to use tests not required by the UK or EU?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-regulatory-authorities-glp',
                        label: 'Will all regulatory testing be conducted in compliance with GLP standards?',
                        hint: 'If not, explain why this is not required.',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-regulatory-authorities-service',
                        label: 'Will this testing be offered as a service to others?',
                        type: 'radio',
                        inline: true,
                        className: 'smaller',
                        options: [
                          {
                            label: 'Yes',
                            value: true,
                            reveal: [
                              {
                                name: 'objectives-regulatory-authorities-service-process',
                                label: 'What is your process for accepting or rejecting work?',
                                type: 'texteditor'
                              },
                              {
                                name: 'objectives-regulatory-authorities-service-criteria',
                                label: 'What specific criteria will you use to decide whether to accept or reject work?',
                                type: 'texteditor'
                              },
                              {
                                name: 'objectives-regulatory-authorities-service-others',
                                label: 'Will others help you make decisions about accepting or rejecting work?',
                                hint: 'If so, who and how?',
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
              },
              {
                name: 'objectives-non-regulatory',
                label: 'Will you be undertaking non-regulatory testing or screening as a service to others?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'objectives-non-regulatory-process',
                        label: 'What is your process for accepting or rejecting work?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-non-regulatory-criteria',
                        label: 'What specific criteria will you use to decide whether to accept or reject work?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-non-regulatory-others',
                        label: 'Will others help you make decisions about accepting or rejecting work?',
                        hint: 'If so, who and how?'
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
                name: 'objectives-genetically-altered',
                label: 'Will you be producing genetically altered or surgically prepared animals/animal products using standardised protocol frameworks?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'objectives-genetically-altered-quality',
                        label: 'How do you assure the quality of the products?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-genetically-altered-supply',
                        label: 'How will you match the supply of your products with demand?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-genetically-altered-service',
                        label: 'Will these products be offered as a service to others?',
                        type: 'radio',
                        inline: true,
                        className: 'smaller',
                        options: [
                          {
                            label: 'Yes',
                            value: true,
                            reveal: [
                              {
                                name: 'objectives-genetically-altered-service-process',
                                label: 'What is your process for accepting or rejecting work?',
                                type: 'texteditor'
                              },
                              {
                                name: 'objectives-genetically-altered-service-criteria',
                                label: 'What specific criteria will you use to decide whether to accept or reject work?',
                                type: 'texteditor'
                              },
                              {
                                name: 'objectives-genetically-altered-service-others',
                                label: 'Will others help you make decisions about accepting or rejecting work?',
                                hint: 'If so, who and how?',
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
              },
              {
                name: 'objectives-vaccines',
                label: 'Will you be manufacturing vaccines and medicines for medical or veterinary use?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'objectives-vaccines-glp',
                        label: 'Will all manufacturing be conducted in compliance with GLP standards?',
                        hint: 'If not, explain why this is not required.',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-vaccines-describe',
                        label: 'Describe how animals are used throughout the manufacturing process.',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-vaccines-tests',
                        label: 'What animal-based tests do you need to undertake on your products, and for which regulator?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-vaccines-quality',
                        label: 'How do you assure the quality of your products?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-vaccines-supply',
                        label: 'How will you match the supply of your products with demand?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-vaccines-criteria',
                        label: 'What specific criteria will you use to decide whether to accept or reject work?',
                        type: 'texteditor'
                      },
                      {
                        name: 'objectives-vaccines-refined',
                        label: 'Will you use animals to develop and validate more refined methods or non-animal alternatives?',
                        type: 'radio',
                        inline: true,
                        className: 'smaller',
                        options: [
                          {
                            label: 'Yes',
                            value: true,
                            reveal: {
                              name: 'objectives-vaccines-refined-explain',
                              label: 'Explain the type of work you will do, and indicate which steps in the manufacturing process this relates to.',
                              type: 'texteditor'
                            }
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
          }
        ]
      },
      'general-principles': {
        title: 'General principles',
        fields: [
          {
            label: 'Unnecessary duplication of work must be avoided. Under what circumstances would you knowingly duplicate work?',
            name: 'general-principles-duplicate',
            type: 'texteditor'
          },
          {
            name: 'experimental-design-sexes',
            label: 'Will any of your protocols or experiments only use animals of a single sex?',
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
                value: false,
                reveal: {
                  name: 'experimental-design-sexes-justification',
                  label: 'Why will you use animals of a single sex in some protocols or experiments?',
                  type: 'texteditor'
                }
              }
            ]
          },
        ]
      },
      benefits: {
        title: 'Benefits',
        nts: true,
        fields: [
          {
            name: 'benefit-outputs',
            label: 'What outputs do you think you will see at the end of this project?',
            hint: 'Outputs can include new information, publications, or products.',
            type: 'texteditor'
          },
          {
            name: 'benefit-who',
            label: 'Who or what will benefit from these outputs?',
            hint: 'The impact of these outputs may be seen in the short-term, or they may not be fully realised until you\'ve completed the project. Consider all timescales in your answer.',
            type: 'texteditor'
          },
          {
            name: 'benefit-service',
            label: 'Will this work be offered as a service to others?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: {
                  name: 'benefit-service-benefits',
                  label: 'What are the benefits of offering this work as a service?',
                  type: 'texteditor'
                }
              },
              {
                label: 'No',
                value: false
              }
            ]
          },
          {
            name: 'benefit-maximise-outputs',
            label: 'How will you look to maximise the outputs of this work?',
            hint: 'For example, collaboration, dissemination of new knowledge, or publication of unsuccessful approaches.',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  protocols: {
    title: 'Protocols',
    subsections: {
      protocols: {
        title: 'Protocols',
        name: 'protocols',
        component: Protocols,
        review: ProtocolsReview,
        repeats: 'protocols',
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'text'
          },
        ],
        sections: {
          details: {
            title: 'Protocol details',
            fields: [
              {
                name: 'description',
                label: 'Briefly describe the purposes of this protocol',
                hint: 'Ensure that you state any relevant regulatory guidelines.',
                type: 'texteditor'
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
                name: 'severity-details',
                label: 'Why are you proposing this severity category?',
                type: 'texteditor'
              },
              {
                name: 'locations',
                label: 'Select the establishments or POLEs where this protocol will be carried out.',
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
                name: 'outputs',
                label: 'What outputs are expected to arise from this protocol?',
                hint: 'For example, test results, phenotypic information, or products.',
                type: 'texteditor'
              }
            ]
          },
          animals: {
            title: 'Animals used in this protocol',
            repeats: 'speciesDetails',
            fields: [
              {
                name: 'species',
                label: 'Which types of animals would you like to add to this protocol?',
                type: 'checkbox',
                className: 'smaller',
                inline: true,
                section: 'intro'
              },
              {
                name: 'life-stages',
                label: 'Which life stages will be used during this protocol?',
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
                label: 'Will any animals coming on to this protocol be classed as ‘continued use’?',
                hint: '‘Continued use’ describes animals that are specificially genetically altered and bred for scientific use or animals that have had procedures applied to them in order to be prepared for use in this protocol.',
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
                label: 'Will you be re-using animals on to this protocol?',
                hint: '‘Re-use’ describes using animals again for a new experiment when you could equally use a naïve animal to get the same results.',
                type: 'radio',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'reuse-details',
                      label: 'Describe any procedure that may have been applied to these animals, and why you are choosing to re-use them.',
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
                name: 'maximum-times-used',
                label: 'What is the maximum number of uses of this protocol on this type of animal?',
                hint: 'For example, you will use 200 mice during a protocol. Each animal will go through the protocol once, but 100 of them will have it applied twice. Therefore, the total number of uses would be 300.',
                type: 'text'
              }
            ]
          },
          gaas: {
            title: 'Genetically altered animals (GAA)',
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
          steps: {
            title: 'Steps',
            hint: 'A step can be a single procedure or a combination of procedures to achieve an outcome. You will be able to reorder your steps at any time before you send your application to the Home Office, but they should be broadly chronological, with the final step being a method of killing or the last regulated procedure.',
            footer: 'Once you’ve created a list of steps, you need to add information about adverse effects, controls and limitations, and humane endpoints to each one.​',
            repeats: 'step',
            fields: [
              {
                name: 'title',
                type: 'texteditor',
                label: 'Describe the procedures that will be carried out during this step.',
                hint: 'Explain where one or more steps are repeated in one experiment, list any alternative techniques within a step (e.g. dosing routes), and include all procedures performed under terminal anaesthesia.\n\nWhen describing the technical aspects of a step, be broad enough to be flexible when the variation does not impact on animal welfare (e.g. use "antibiotic" instead of "penicillin"). Finally, avoid specifying volumes and frequencies when they do not impact on animal welfare.'
              },
              {
                name: 'code',
                label: 'Select the anaesthetic codes that apply to this step.',
                type: 'checkbox',
                options: [
                  {
                    label: 'AA (no anaesthesia)',
                    value: 'aa'
                  },
                  {
                    label: 'AB (general anaesthesia with recovery)',
                    value: 'ab'
                  },
                  {
                    label: 'AB-L (local anaesthesia)',
                    value: 'abl'
                  },
                  {
                    label: 'AC (non-recovery general anaesthesia)​',
                    value: 'ac'
                  },
                  {
                    label: 'AD (neuromuscular blocking agent)',
                    value: 'ad'
                  }
                ],
                className: 'smaller'
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
                label: 'Do you expect this step to have any adverse effects for the animals?',
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
                        label: 'What are the likely adverse effects of this step?​',
                        hint: 'State the signs of each adverse effect, including the likely incidence, and the anticipated degree and duration of suffering.',
                        type: 'texteditor'
                      },
                      {
                        name: 'prevent-adverse-effects',
                        label: 'How will you monitor for, control, and limit any of these adverse effects?​',
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
              }
            ]
          },
          experience: {
            title: 'Animal experience',
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
            fields: [
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
                        label: 'Will your experimental design be determined by a regulatory guideline or similar?',
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
            fields: [
              {
                name: 'most-appropriate',
                label: 'a) the most appropriate scientific approach?​',
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
                        label: 'How will you determine an appropriate dosing regimen?​',
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
          fate: {
            title: 'Fate of animals',
            fields: [
              {
                name: 'fate',
                label: 'What will happen to animals at the end of this protocol?​',
                hint: 'Select all that apply',
                type: 'checkbox',
                className: 'smaller',
                options: [
                  {
                    label: 'Killed',
                    value: 'killed',
                    reveal: {
                      label: '',
                      review: 'Method of killing',
                      name: 'killing-method',
                      type: 'checkbox',
                      className: 'smaller',
                      options: [
                        {
                          label: 'Schedule 1 method​',
                          value: 'schedule-1'
                        },
                        {
                          label: 'Non-schedule 1 killing of a conscious animal',
                          value: 'other',
                          reveal: {
                            name: 'method-and-justification',
                            label: 'For each non-schedule 1 method, explain why this is necessary.',
                            type: 'texteditor'
                          }
                        }
                      ]
                    }
                  },
                  {
                    label: 'Kept alive',
                    value: 'kept-alive'
                  },
                  {
                    label: 'Continued use on another protocol in this project',
                    value: 'continued-use',
                    reveal: {
                      name: 'continued-use-relevant-project',
                      label: 'Please state the relevant protocol.',
                      type: 'texteditor'
                    }
                  },
                  {
                    label: 'Continued use on other projects',
                    value: 'continued-use-2'
                  }
                ]
              }
            ]
          },
          conditions: {
            title: 'Additional conditions and authorisations',
            show: props => props.showConditions
          }
        }
      },
      'project-harms': {
        title: 'Project harms',
        nts: true,
        fields: [
          {
            name: 'project-harms-animals',
            label: 'Explain why you are using these types of animals and your choice of life stages.',
            type: 'texteditor'
          },
          {
            name: 'project-harms-summary',
            label: 'Typically, what will be done to an animal used in your project?',
            hint: 'For example, injections and surgical procedures. Include any relevant information about the duration of experiments and the number of procedures.',
            type: 'texteditor'
          },
          {
            name: 'project-harms-effects',
            label: 'What are the expected impacts and/or adverse effects for the animals during your project?',
            hint: 'Examples can include pain, weight loss, tumours, or abnormal behaviour. State the estimated duration of these effects on an animal.',
            type: 'texteditor'
          },
          {
            name: 'project-harms-severity',
            label: 'What are the expected severities and the proportion of animals in each category (per animal type)?',
            type: 'texteditor'
          }
        ]
      },
      'fate-of-animals': {
        title: 'Fate of animals',
        nts: true,
        fields: [
          {
            name: 'fate-of-animals',
            label: 'What will happen to animals at the end of their use in this project?',
            type: 'checkbox',
            className: 'smaller',
            options: [
              {
                label: 'Kept alive',
                value: 'kept-alive',
                reveal: [
                  {
                    name: 'kept-alive-animals',
                    label: 'What types of animals will you keep alive?',
                    type: 'texteditor'
                  },
                  {
                    name: 'keeping-animals-alive-determine',
                    label: 'What criteria will the veterinary surgeon, or competent person trained by a veterinary surgeon, use to determine whether animals can be kept alive?',
                    type: 'texteditor'
                  },
                  {
                    name: 'keeping-animals-alive-supervised',
                    label: 'Are there any limitations on the period of time that animals that have been kept alive can be held under the supervision of the veterinary surgeon?',
                    type: 'texteditor'
                  }
                ]
              },
              {
                label: 'Set free',
                value: 'set-free',
                reveal: [
                  {
                    name: 'setting-free-health',
                    label: 'How will an animal\'s health be assessed to determine whether it can be set free?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-vet',
                    label: 'Will a veterinary surgeon perform this assessment?',
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
                        value: false,
                        reveal: {
                          name: 'setting-free-competence',
                          label: 'How will you ensure the competence of the person responsible for assessing whether animals can be set free?',
                          type: 'texteditor'
                        }
                      }
                    ]
                  },
                  {
                    name: 'setting-free-ensure-not-harmful',
                    label: 'How will you ensure that setting animals free will not be harmful to other species, the environment, and human health?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-rehabilitate',
                    label: 'Will you rehabilitate animals before setting them free? If so, how?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-socialise',
                    label: 'Will you attempt to socialise any animals that you have set free? If so, how?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-recapturing',
                    label: 'How will you prevent inadvertent re-use of animals that have been released at the end of procedures?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-lost',
                    label: 'If animals are lost to the study or not re-captured, how will you determine whether your project is complete?',
                    hint: 'This information is important to ensure that the use of these animals is recorded in the return of procedures, and is considered when determining the actual severity of your protocols.',
                    type: 'texteditor'
                  }
                ]
              },
              {
                label: 'Rehomed',
                value: 'rehomed',
                reveal: [
                  {
                    name: 'rehoming-types',
                    label: 'What types of animals do you intend to rehome?',
                    hint: 'Also state the protocols on which they would have been used.',
                    type: 'texteditor'
                  },
                  {
                    name: 'rehoming-healthy',
                    label: 'How will you make sure that an animal’s health allows it to be rehomed?',
                    type: 'texteditor'
                  },
                  {
                    name: 'rehoming-harmful',
                    label: 'How will you ensure that rehoming does not pose a danger to public health, animal health, or the environment?',
                    type: 'texteditor'
                  },
                  {
                    name: 'rehoming-socialisation',
                    label: 'What scheme is in place to ensure socialisation when an animal is rehomed?',
                    type: 'texteditor'
                  },
                  {
                    name: 'rehoming-other',
                    label: 'What other measures will you take to safeguard an animal’s wellbeing when it is rehomed?',
                    type: 'texteditor'
                  }
                ]
              },
              {
                label: 'Used in other projects',
                value: 'used-in-other-projects'
              }
            ]
          }
        ]
      }
    }
  },
  useOfAnimals: {
    title: 'Use of animals',
    subsections: {
      domestic: {
        title: 'Cats, dogs, and equidae',
        intro: 'You are seeing this section because you added a type of cat, dog, or equid to your project. To change this, go to Introductory details.',
        show: values => intersection(
          flatten([
            SPECIES.CAT,
            SPECIES.DOG,
            SPECIES.EQU
          ]).map(s => s.value),
          values.species
        ).length,
        fields: [
          {
            name: 'domestic',
            label: 'What are the scientific reasons for using cats, dogs, or equidae in your project?',
            hint: 'A licence cannot be granted unless your scientific objectives or research questions can only be achieved or answered by the use of cats, dogs or equidae. This includes instances when it is not practicable to obtain other types of animal.',
            type: 'texteditor'
          }
        ]
      },
      nhps: {
        title: 'Non-human primates',
        intro: 'You are seeing this section because you added a non-human primate to your project. To change this, go to Introductory details.',
        show: values => intersection(SPECIES.NHP.map(s => s.value), values.species).length,
        fields: [
          {
            name: 'nhps',
            label: 'Why do you need to use non-human primates, rather than any other type of animal, to achieve your objectives?',
            type: 'texteditor'
          },
          {
            name: 'nhps-justification',
            label: 'Explain how the project is for one of the permitted purposes.',
            hint: `The permitted purposes for the use of non-human primates are:

* basic research
* translational or applied research for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
* the development, manufacture or testing of the quality, effectiveness and safety of drugs for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
* research aimed at preserving the species of animal subjected to regulated procedures`,
            type: 'texteditor'
          },
          {
            name: 'wild-caught-primates',
            label: 'Might any of these non-human primates be wild-caught?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: {
                  name: 'wild-caught-primates-justification',
                  label: 'Why can\'t you achieve your objectives without using wild-caught non-human primates?',
                  type: 'texteditor'
                }
              },
              {
                label: 'No',
                value: false
              }
            ]
          },
          {
            name: 'marmoset-colony',
            label: 'Will all marmosets be sourced from a self-sustaining colony?',
            hint: `This is a colony that is kept in captivity in a way that:

* ensures animals are accustomed to humans.
* consists only of animals that have been bred in captivity.
* is sustained only by animals bred within the same colony, or animals that are sourced from another self-sustanining colony.`,

            type: 'radio',
            inline: true,
            className: 'smaller',
            show: values => (values.species || []).includes('marmosets'),
            options: [
              {
                label: 'Yes',
                value: true
              },
              {
                label: 'No',
                value: false,
                reveal: {
                  name: 'marmoset-colony-justification',
                  label: 'Why can’t you achieve your objectives without using marmosets from a self-sustaining colony?',
                  type: 'texteditor'
                }
              }
            ]
          }
        ]
      },
      'purpose-bred-animals': {
        title: 'Purpose bred animals',
        fields: [
          {
            name: 'purpose-bred',
            label: 'Will all animals used in your project be purpose bred?',
            hint: 'This means animals that have been bred primarily to be used in regulated procedures or for the use of their tissues or organs for scientific purposes.',
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
                value: false,
                reveal: [
                  {
                    name: 'purpose-bred-sourced',
                    label: 'Where will you obtain non-purpose bred animals from?',
                    hint: 'Consider the source of all animals you plan to use, as this information will help to assess the impact on the scientific output and the quality of the animal.',
                    type: 'texteditor'
                  },
                  {
                    name: 'purpose-bred-justification',
                    label: 'Why can’t you achieve your objectives by only using purpose bred animals?',
                    type: 'texteditor'
                  }
                ]
              }
            ]
          }
        ]
      },
      'endangered-animals': {
        title: 'Endangered animals',
        fields: [
          {
            name: 'endangered-animals',
            label: 'Will you be using any endangered animals (excluding non-human primates)?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'endangered-animals-justification',
                    label: 'Why can’t you achieve your objectives without using endangered animals?',
                    type: 'texteditor'
                  },
                  {
                    name: 'endangered-animals-permitted',
                    label: 'Explain how the project is for one of the permitted purposes.',
                    hint: `The permitted purposes for the use of endangered animals are:

  * translational or applied research for the avoidance, prevention, diagnosis or treatment of disease, ill-health or other abnormality, or their effects, in man, animals or plants
  * the development, manufacture or testing of the quality, effectiveness and safety of drugs, feed-stuffs or any other substances or products for the avoidance, prevention, diagnosis or treatment of disease, ill-health or other abnormality, or their effects, in man, animals or plants or assessment, detection, regulation or modification of physiological conditions in man, animals or plants or the improvement of the welfare of animals or of the production conditions for animals reared for  agricultural purposes
  * research aimed at the preservation of the species`,
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
      'animals-taken-from-the-wild': {
        title: 'Animals taken from the wild',
        steps: [
          {
            title: 'Animals taken from the wild - 1 of 2',
            fields: [
              {
                name: 'wild-animals',
                label: 'Will you be using any animals taken from the wild?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'wild-animals-justification',
                        label: 'Why can’t you achieve your objectives without using animals taken from the wild?',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-caught',
                        label: 'How will these animals be captured?',
                        hint: 'Explain how each method is the most refined for the animal type or purpose of the study. Also include any relevant considerations around trapping, including the frequency of checks and trap positioning.',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-potential-harms',
                        label: 'How will you minimise potential harms when catching these animals?',
                        type: 'texteditor'
                      },
                      {
                        name: 'non-target-species-capture-methods',
                        label: 'Will your capture methods catch non-target animals?',
                        type: 'radio',
                        inline: true,
                        className: 'smaller',
                        options: [
                          {
                            label: 'Yes',
                            value: true,
                            reveal: {
                              name: 'non-target-species-capture-methods-minimise-suffering',
                              label: 'How will you minimise the risk of capturing non-target animals, including strays and animals of a different sex?',
                              type: 'texteditor'
                            }
                          },
                          {
                            label: 'No',
                            value: false
                          }
                        ]
                      },
                      {
                        name: 'wild-animals-competence',
                        label: 'How will you ensure the competence of any person responsible for the capture of animals?',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-examine',
                        label: 'How will you examine any animals that are found to be ill or injured at the time of capture?',
                        hint: 'Include details about what will be done with these animals after they have been examined.',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-vet',
                        label: 'Will a veterinary surgeon perform the examination?',
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
                            value: false,
                            reveal: {
                              name: 'wild-animals-vet-competence',
                              label: 'How will you ensure the competence of the person responsible for making this assessment?',
                              type: 'texteditor'
                            }
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
          {
            title: 'Animals taken from the wild - 2 of 2',
            show: values => values['wild-animals'] === true,
            fields: [
              {
                name: 'wild-animals-transport',
                label: 'If sick or injured animals are to be treated, how will you transport them for treatment?',
                hint: 'Include how you will ensure that any potential harms during their transport will be minimised.',
                type: 'texteditor'
              },
              {
                name: 'wild-animals-killing-method',
                label: 'If sick or injured animals are to be humanely killed, which methods will you use?',
                type: 'texteditor'
              },
              {
                name: 'wild-animals-identify',
                label: 'How will animals be identified?',
                type: 'texteditor'
              },
              {
                name: 'wild-animals-devices',
                label: 'Will any devices be attached to or implanted in animals during this project?',
                hint: 'For example, any device used to identify, track, and monitor an animal’s behaviour in its natural habitat.',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'wild-animals-devices-effects',
                        label: 'How will any adverse effects from a device\'s attachment or implantation be minimised?',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-devices-removal',
                        label: 'How will you locate and recapture the animals or otherwise ensure the devices are removed at the end of the regulated procedures?',
                        hint: 'If devices will not be removed, explain why it is not required.',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-devices-environment-effects',
                        label: 'If animals will not have devices removed, what are the potential effects on them, other animals, the environment and human health?',
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
                name: 'wild-animals-declaration',
                label: '',
                type: 'checkbox',
                className: 'smaller',
                options: [
                  {
                    label: 'I confirm that I have, or will have, all necessary permissions from other regulators in place before commencing any work involving animals taken from the wild.',
                    value: 'yes'
                  }
                ]
              }
            ]
          }
        ]
      },
      'feral-animals': {
        title: 'Feral animals',
        fields: [
          {
            name: 'feral-animals',
            label: 'Will you be using any feral animals in your project?',
            hint: 'A feral animal is an animal living in the wild but descended from domesticated individuals.',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'feral-animals-justification',
                    label: 'Why can\'t you use non-feral animals to achieve your objectives?',
                    type: 'texteditor'
                  },
                  {
                    name: 'feral-animals-essential',
                    label: 'Why is the use of feral animals essential to protect the health or welfare of that species or to avoid a serious threat to human or animal health or the environment?',
                    type: 'texteditor'
                  },
                  {
                    name: 'feral-animals-procedures',
                    label: 'Which procedures will be carried out on feral animals? And under which protocols?',
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
      }
    }
  },
  otherConsiderations: {
    title: 'Other considerations',
    subsections: {
      nmbas: {
        title: 'Neuromuscular blocking agents (NMBAs)',
        show: values => some(values.protocols, protocol => {
          return some(protocol.steps, step => step.code && step.code.includes('ad'));
        }),
        linkTo: 'protocols',
        steps: [
          {
            title: 'Neuromuscular blocking agents (NMBAs) - 1 of 2',
            intro: 'You are seeing this section because you will be using an NMBA during your project. To change this, go to Protocols.',
            fields: [
              {
                name: 'nmbas-why',
                label: 'Why do you need to use NMBAs in your protocols?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-anaesthetic',
                label: 'What anaesthetic and analgesic regime will you use?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-ventilation',
                label: 'How will you ensure that animals have adequate ventilation?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-pain',
                label: 'How will you minimise pain, suffering, and distress for an animal under the influence of an NMBA?',
                type: 'texteditor'
              }
            ]
          },
          {
            title: 'Neuromuscular blocking agents (NMBAs) - 2 of 2',
            intro: 'You are seeing this section because you will be using an NMBA during your project. To change this, go to Protocols.',
            fields: [
              {
                name: 'nmbas-depth',
                label: 'How will you monitor the depth of anaesthesia?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-people',
                label: 'How will you ensure there are sufficient staff present throughout the use of NMBAs (including during recovery periods) who are competent to use them in these types of animal?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-emergency-routine',
                label: 'Explain the agreed emergency routine at your establishment that covers potential hazardous events (such as a power failure).',
                type: 'texteditor'
              }
            ]
          }
        ]
      },
      'reusing-animals': {
        title: 'Re-using animals',
        fields: [
          {
            name: 'reusing-animals',
            label: 'Will you be re-using animals?',
            type: 'radio',
            className: 'smaller',
            inline: true,
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'reusing-which',
                    label: 'What types of animals will you be re-using?',
                    type: 'texteditor'
                  },
                  {
                    name: 'reusing-why',
                    label: 'Why do you intend to re-use animals?',
                    hint: 'Explain how you will balance the needs of refining and reducing animal use before making your decision.',
                    type: 'texteditor'
                  },
                  {
                    name: 'reusing-limitations',
                    label: 'What are the limitations on re-using animals for this project?',
                    hint: 'For example, there may be a maximum number of times that an animal can be re-used, or a set of performance standards that requires a limit on re-use.',
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
      'commercial-slaughter': {
        title: 'Commercial slaughter',
        fields: [
          {
            name: 'commercial-slaughter',
            label: 'Will you send any farm animals to a commercial slaughterhouse at the end of their use?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: {
                  name: 'commercial-slaughter-hygiene',
                  label: 'How will you ensure that these animals are healthy and meet commercial requirements for meat hygiene to enable them to enter the food chain?',
                  hint: 'Include any relevant information about drug withdrawal times.',
                  type: 'texteditor'
                }
              },
              {
                label: 'No',
                value: false
              }
            ]
          }
        ]
      },
      'containing-human-material': {
        title: 'Animals containing human material',
        fields: [
          {
            name: 'animals-containing-human-material',
            label: 'Do you intend to use animals containing human material in experiments classed as Category 2 or 3 by the Academy of Medical Sciences?',
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
          }
        ]
      }
    }
  },
  threeRs: {
    title: 'The 3Rs',
    subsections: {
      replacement: {
        title: 'Replacement',
        playback: 'project-aim',
        reviewTitle: '3Rs: Replacement',
        nts: true,
        fields: [
          {
            name: 'replacement-why',
            label: 'Why do you need to use animals to achieve the aim of your project?',
            type: 'texteditor'
          },
          {
            name: 'replacement-alternatives',
            label: 'Which non-animal alternatives did you consider for use in this project?',
            type: 'texteditor'
          },
          {
            name: 'replacement-justification',
            label: 'Why were they not suitable?',
            type: 'texteditor'
          }
        ]
      },
      reduction: {
        title: 'Reduction',
        reviewTitle: '3Rs: Reduction',
        nts: true,
        fields: [
          {
            name: 'reduction-quantities',
            label: 'Enter the estimated number of animals of each type used in this project.',
            type: 'animal-quantities'
          },
          {
            name: 'reduction-estimation',
            label: 'How have you estimated the numbers of animals you will use?',
            hint: 'For example, you may have made some power calculations or carried out some statistical modelling.',
            type: 'texteditor'
          },
          {
            name: 'reduction-steps',
            label: 'What steps did you take during the experimental design phase to reduce the number of animals being used in this project?',
            hint: 'Include advice taken from local statisticians, online tools (such as the NC3Rs\' Experimental Design Assistant), or regulatory requirements.',
            type: 'texteditor'
          },
          {
            name: 'reduction-review',
            label: 'What measures, apart from good experimental design, will you use to optimise the number of animals you plan to use in your project.',
            hint: 'This may include efficient breeding, pilot studies, computer modelling, or sharing of tissue.',
            type: 'texteditor'
          }
        ]
      },
      refinement: {
        title: 'Refinement',
        reviewTitle: '3Rs: Refinement',
        nts: true,
        fields: [
          {
            name: 'refinement-models',
            label: 'Which animal models and methods will you use during this project?',
            hint: 'Explain why these models and methods cause the least pain, suffering, distress, or lasting harm to the animals.',
            type: 'texteditor'
          },
          {
            name: 'refinement-explaination',
            label: 'How will you refine the procedures you\'re using to minimise harm for the animals?',
            hint: 'Potential refinements include increased monitoring, post-operative care, pain management, and training of animals.',
            type: 'texteditor'
          },
          {
            name: 'refinement-published-guidance',
            label: 'What published best practice guidance will you follow to ensure experiments are conducted in the most refined way?',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  nts: {
    title: 'Non-technical summary',
    name: 'nts',
    subsections: {
      'nts-review': {
        title: 'Review',
        component: NTSSummary,
        sections: [
          {
            section: 'introduction',
            title: 'Aim and duration',
            fields: [
              'project-aim',
              'project-importance',
              'duration'
            ]
          },
          {
            section: 'benefits',
            title: 'Benefits'
          },
          {
            section: 'project-harms',
            title: 'Anticipated harms'
          },
          {
            section: 'fate-of-animals',
            title: 'Fate of animals'
          },
          {
            section: 'replacement',
            title: 'Replacement'
          },
          {
            section: 'reduction',
            title: 'Reduction'
          },
          {
            section: 'refinement',
            title: 'Refinement'
          }
        ]
      }
    }
  },
  conditions: {
    title: 'Additional conditions and authorisations',
    show: props => props.showConditions,
    subsections: {
      conditions: {
        title: 'Additional conditions and authorisations',
        review: Conditions
      }
    }
  }
}
