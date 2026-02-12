export const gaBreadingData = (isStandard = true) => ({
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
            severity: "Mild",
            species: ["mice"],
            speciesDetails: [
              {
                id: "breeding-mice-1",
                name: "Mice",
                value: "mice",
                lifeStages: ["embryo", "neonate", "juvenile", "adult", "pregnant", "aged"],
                maximumAnimals: "20",
                maximumTimesUsed: "1",
                reuse: ["no"]
              }
            ],
            description: "To produce, maintain and provide genetically altered (GA) mice and/or rats",
            "severity-details": "Mild severity breeding protocol."
          }
        },
      ]
    }
  ]
});
