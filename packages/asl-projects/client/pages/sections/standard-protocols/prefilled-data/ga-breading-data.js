import { v4 as uuid } from 'uuid';
import { slateFormat } from '../../../../helpers/slate-format';

export const gaBreadingData = (isStandard = true, isExperimental = false) => ({
  title: "Add a standard GA breeding protocol",
  description: "Select a protocol",
  groups: [
    {
      title: "GA breeding protocols for mice and rats",
      protocols: [
        {
          id: "rodent-breeding-mild",
          value: "rodent-breeding-mild",
          label: "Breeding and maintenance of genetically altered rodents (mild)",
          data: {
            title: "Breeding and maintenance of genetically altered rodents",
            isStandardProtocol: isStandard,
            standardProtocolType: isStandard ? 'standard-ga-breeding' : 'editable-ga-breeding',
            severity: isStandard ? "Mild" : "mild",
            'severity-proportion': isStandard ? 'Most animals will experience mild harms.' : slateFormat('Most animals will experience mild harms.'),
            "severity-details": "The phenotypes are subthreshold or mild. Tissue sampling is only expected to cause transient discomfort but no lasting harm.",
            speciesDetails: [
              {
                lifeStages: ["embryo", "neonate", "juvenile", "adult", "pregnant"],
              }
            ],
            description: "To produce, maintain and provide genetically altered (GA) mice and/or rats",

          }
        },
      ]
    }
  ]
});
