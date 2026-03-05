const generatePrefilledSteps = (isStandard = false) => [
  {
    title: '"The production and birth of GA offspring is permitted using either of the following methods:  \n' +
      '• breeding by conventional methods  \n' +
      '• generation of GA embryos by in vitro manipulation and/or fertilisation, followed by development in an embryo recipient (the GA embryos are covered in this protocol, whereas the embryo recipients are covered in the ‘Embryo recipients’ protocol)"',
    reference: 'Production and birth of genetically altered offspring (optional)',
    optional: true,
    adverse: false,
    completed: isStandard,
    'adverse-effects': '',
    'prevent-adverse-effects': '',
    isStandardProtocol: isStandard,
    standardProtocolType: isStandard ? 'standard' : 'editable',
    endpoints: '',
    readonly: isStandard,
    reusable: false
  },
  {
    title: '"See General constraints.\n' +
      '\n' +
      'The method used to determine genetic status will be the least invasive and is only expected to cause short-term pain, suffering or distress and no lasting harm - for example, ear biopsy, blood sampling or non-invasive imaging (AA/AB).\n' +
      '\n' +
      'Where possible, sampling will be carried out at the earliest feasible life stage. A second sample will only be taken in rare cases where there are technical problems during analysis.\n' +
      '\n' +
      'NVS advice will be followed regarding the use of analgesia."',
    reference: 'Determining genetic status (optional)',
    optional: true,
    adverse: false,
    completed: isStandard,
    isStandardProtocol: isStandard,
    standardProtocolType: isStandard ? 'standard' : 'editable',
    'adverse-effects': '',
    'prevent-adverse-effects': '',
    endpoints: '',
    readonly: isStandard,
    reusable: false
  },
  {
    title: 'Animals may be kept for as long as they are still able to breed without showing any signs of harm.',
    reference: 'Maintenance (mandatory)',
    optional: false,
    adverse: false,
    completed: isStandard,
    isStandardProtocol: isStandard,
    standardProtocolType: isStandard ? 'standard' : 'editable',
    'adverse-effects': '',
    'prevent-adverse-effects': '',
    endpoints: '',
    readonly: isStandard,
    reusable: false
  },
  {
    title: '"Substances to suppress the harmful phenotype, for example doxycycline or other compounds, may be administered by one of the following routes:\n' +
      '• oral, including in diet or water, or by oral gavage (AA/AB)\n' +
      '• intraperitoneal (AA/AB)\n' +
      '• subcutaneous (AA/AB)"',
    reference: 'Administration of substances to suppress harmful phenotypes (optional)',
    optional: false,
    adverse: false,
    completed: isStandard,
    isStandardProtocol: isStandard,
    standardProtocolType: isStandard ? 'standard' : 'editable',
    'adverse-effects': '',
    'prevent-adverse-effects': '',
    endpoints: '',
    readonly: isStandard,
    reusable: false
  },
  {
    title: '"Animals may be killed using either of the following methods:  \n' +
      '• a Schedule 1 method\n' +
      '• a non-Schedule 1 method under non-recovery anaesthesia, followed by a Schedule 1 completion method"',
    reference: 'Terminal step (optional)',
    optional: true,
    adverse: false,
    completed: isStandard,
    isStandardProtocol: isStandard,
    standardProtocolType: isStandard ? 'standard' : 'editable',
    'adverse-effects': '',
    'prevent-adverse-effects': '',
    endpoints: '',
    readonly: isStandard,
    reusable: false
  }
];

export const gaBreadingData = (isStandard = true, isExperimental = false) => {
  return {
    title: 'Add a standard GA breeding protocol',
    description: 'Select a protocol',
    groups: [
      {
        title: 'GA breeding protocols for mice and rats',
        protocols: [
          {
            id: 'rodent-breeding-mild',
            value: 'rodent-breeding-mild',
            label: 'Breeding and maintenance of genetically altered rodents (mild)',
            data: {
              title: 'Breeding and maintenance of genetically altered rodents',
              isStandardProtocol: isStandard,
              standardProtocolType: isStandard
                ? 'standard'
                : 'editable',

              severity: isStandard ? 'Mild' : ['mild'],

              severityProportion: 'Most animals will experience mild harms.',

              severityDetails: 'The phenotypes are subthreshold or mild. Tissue sampling is only expected to cause transient discomfort but no lasting harm.',

              description: 'To produce, maintain and provide genetically altered (GA) mice and/or rats',

              speciesDetails: [
                {
                  lifeStages: [
                    'embryo',
                    'neonate',
                    'juvenile',
                    'adult',
                    'pregnant'
                  ],
                  continuedUse: isStandard,
                  reuse: isStandard ? ['no'] : undefined,
                  reuseDetails: 'Animals will not be used more than once within this protocol.',

                  continuedUseSourced:
                    'GA animals for use in this protocol (with or without associated wild types) may be obtained from:\n' +
                    '• another mild protocol in this licence\n' +
                    '• a moderate protocol in this licence, unless they are showing harmful phenotypes\n' +
                    '• other project licences authorised to breed and maintain the same animal type and provide them for use on other projects'
                }
              ],
              reuseDetails: 'Animals that have come from another protocol in this project or another project will not be re-used in this protocol.',
              gaas: true,
              gaasTypes: 'Only strains experiencing mild severity phenotypes will be used in this protocol. ',
              gaasHarmful: false,

              steps: generatePrefilledSteps(isStandard),
            }
          }
        ]
      }
    ]
  };
}


