const generatePrefilledSteps = (isStandard = false) => [
  {
    title: `The production and birth of GA offspring is permitted using either of the following methods:
      \n• breeding by conventional methods
      \n• generation of GA embryos by in vitro manipulation and/or fertilisation, followed by development in an embryo recipient (the GA embryos are covered in this protocol, whereas the embryo recipients are covered in the ‘Embryo recipients’ protocol)`,
    reference: 'Production and birth of genetically altered offspring',
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
    title: `See General constraints.
      \nThe method used to determine genetic status will be the least invasive and is only expected to cause short-term pain, suffering or distress and no lasting harm - for example, ear biopsy, blood sampling or non-invasive imaging (AA/AB).
      \nWhere possible, sampling will be carried out at the earliest feasible life stage. A second sample will only be taken in rare cases where there are technical problems during analysis.
      \nNVS advice will be followed regarding the use of analgesia.`,
    reference: 'Determining genetic status',
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
    reference: 'Maintenance',
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
    title: `Substances to suppress the harmful phenotype, for example doxycycline or other compounds, may be administered by one of the following routes:
      \n• oral, including in diet or water, or by oral gavage (AA/AB)
      \n• intraperitoneal (AA/AB)
      \n• subcutaneous (AA/AB)`,
    reference: 'Administration of substances to suppress harmful phenotypes',
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
    title: `Animals may be killed using either of the following methods:
      \n• a Schedule 1 method
      \n• a non-Schedule 1 method under non-recovery anaesthesia, followed by a Schedule 1 completion method`,
    reference: 'Terminal step',
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
              protocolName: 'rodent-breeding-mild',
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
              fate: [
                "killed",
                "continued-use",
                "continued-use-2",
                "set-free",
                "rehomed",
                "kept-alive"
              ],
              continuedUseRelevantProject: 'Animals may be transferred to another protocol in this project authorised to use the same animal types.',
              nonSchedule1: false
            },
            experienceSummary: `Animals may be used for natural mating on a number of occasions. \nAnimals produced under this protocol are not expected to exhibit any harmful
              phenotype. \nOffspring will be maintained by methods appropriate to their genetic alteration until they reach a maximum of 15 months of age.`,

            experienceEndpoints: `Some animals may have an altered immune system making them more susceptible to infection. Animals with altered immune status will be housed in a barrier environment thereby minimising the likelihood of compromising health.
            \nAny animal will be immediately killed by Schedule 1 method if it shows signs of suffering that is greater than minor and transient or in any way compromises normal behaviour unless moved on to another protocol for a specific purpose (continued use).
            \nAnimals exhibiting any unexpected harmful phenotypes will be killed (Schedule 1), or in the case of individual animals of particular scientific interest, advice will be sought promptly from a Home Office inspector.
            \nOther than those described in the strain-specific adverse effects above, animals are not expected to die because of any authorised genetic alteration. A small number of animals, living beyond the neonatal period (5 days – before which ASRU does not require you to report any mortality), may suddenly and unexpectedly die having shown no preceding clinical signs indicative of impending death. Unless otherwise indicated, such deaths, should they occur, are unlikely to be related to the genotype. However, as per the published ASRU Advice Note on Severity Assessment of GA animals, should the mortality rate (age-matched) of the genetically altered strain rise beyond that present in the background source breeding colony, this will be reported under PPL standard condition 18.`,

            outputs: `Genetically altered mice.
            \n(Note: If you are using this protocol to produce tissues for in vitro use you should include mention of the expected outputs from that use and answer Yes to the question below).`,

            quantitativeData: false
          },
        ]
      }
    ]
  };
}
