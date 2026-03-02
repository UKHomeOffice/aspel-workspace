export const gaBreadingData = (isStandard = true, isExperimental = false) => ({
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
              ? 'standard-ga-breeding'
              : 'editable-ga-breeding',

            severity: isStandard ? 'Mild' : ["mild"],

            severityProportion: 'Most animals will experience mild harms.',

            severityDetails: 'The phenotypes are subthreshold or mild. Tissue sampling is only expected to cause transient discomfort but no lasting harm.',

            description: 'To produce, maintain and provide genetically altered (GA) mice and/or rats',

            // ✅ TEMPLATE DEFINES LIFE STAGES
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
                  '• other project licences authorised to breed and maintain the same animal type and provide them for use on other projects',
              },
            ],
            reuseDetails: 'Animals that have come from another protocol in this project or another project will not be re-used in this protocol.',
            gaas: true,
            gaasTypes: 'Only strains experiencing mild severity phenotypes will be used in this protocol. ',
            gaasHarmful: false


          }
        }
      ]
    }
  ]
});
