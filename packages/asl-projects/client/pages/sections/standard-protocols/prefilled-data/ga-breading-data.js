import { getPrefilledStepsForProtocol } from '../helpers/protocol-step-generators';

export const gaBreadingData = (isStandard = true, isExperimental = false) => {
  return {
    title: 'Add a standard GA breeding protocol',
    description: 'Select a protocol',
    groups: [
      {
        title: 'Mice and rats',
        protocols: [
          {
            id: 'superovulation',
            value: 'superovulation',
            label: 'Superovulation (mild)',
            data: {}
          },
          {
            id: 'embryo-recipients',
            value: 'embryo-recipients',
            label: 'Embryo recipients (moderate)',
            data: {}
          },
          {
            id: 'vasectomy',
            value: 'vasectomy',
            label: 'Vasectomy (moderate)',
            data: {}
          },
          {
            id: 'rodent-breeding-mild',
            value: 'rodent-breeding-mild',
            label: 'Breeding and maintenance of GA mice and rats (mild)',
            data: {
              title: 'Breeding and maintenance of GA mice and rats (mild)',
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

              steps: getPrefilledStepsForProtocol('rodent-breeding-mild', isStandard),
              fate: [
                "killed",
                "continued-use",
                "continued-use-2",
                "set-free",
                "rehomed",
                "kept-alive"
              ],
              continuedUseRelevantProject: 'Animals may be transferred to another protocol in this project authorised to use the same animal types.',
              nonSchedule1: false,

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
          },
          {
            id: 'rodent-breeding-moderate',
            value: 'rodent-breeding-moderate',
            label: 'Breeding and maintenance of GA mice and rats (moderate)',
            data: {}
          }
        ]
      },
      {
        title: 'Zebrafish',
        protocols: [
          {
            id: 'gamete-collection',
            value: 'gamete-collection',
            label: 'Gamete collection (mild)',
            data: {}
          },
          {
            id: 'breading-and-maintenance-of-genetically-altered-zebrafish-mild',
            value: 'breading-and-maintenance-of-genetically-altered-zebrafish-mild',
            label: 'Breeding and maintenance of GA zebrafish (mild)',
            data: {}
          },
          {
            id: 'breading-and-maintenance-of-genetically-altered-zebrafish-moderate',
            value: 'breading-and-maintenance-of-genetically-altered-zebrafish-moderate',
            label: 'Breeding and maintenance of GA zebrafish (moderate)',
            data: {}
          }
          ]
      }
    ]
  };
}
