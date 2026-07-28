import { getPrefilledStepsForProtocol } from '../helpers/protocol-step-generators';

export const gaBreadingData = (isStandard = true) => {
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

              severity: isStandard ? 'Mild' : 'mild',

              severityProportion: 'Most animals will experience mild harms.',

              severityDetails: 'The phenotypes are subthreshold or mild. Tissue sampling is only expected to cause mild short-term pain, suffering or distress and no lasting harm.',

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
                  reuse: ['yes'],
                  reuseDetails: null,

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
              continuedUseRelevantProject: 'Animals may be transferred to another protocol in this project authorised to use the same animal types.',
              nonSchedule1: false,

              experienceSummary: `Animals will be bred by natural mating.\nAnimals may undergo procedures for genotyping.\nAnimals will be kept for breeding or maintenance. \nAnimals with an altered immune system will be housed in a barrier environment to reduce risk of infection.`,

              experienceEndpoints: `Animals will be killed immediately if:\n
• they experience more than mild short-term adverse effects that cannot be resolved with minor interventions - unless they are being transferred to another protocol for a specific purpose (continued use) \n
• they show any harmful phenotypes despite, for example, use of a barrier environment \n

If animals show a significantly higher incidence of adverse effects or mortality compared with the background strain, this will be reported using the SC18 notification form. Individual deaths that occur in the neonatal period (first 5 days) do not need to be reported. \n

If animals show any harmful phenotypes and they are required to achieve the project’s scientific outcomes: \n
• a request will be made to keep them alive using the SC18 notification form \n
• a project licence amendment may be required`,

              outputs: `• GA mice and/or rats \n
• Tissues for in vitro use (optional)`,

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

