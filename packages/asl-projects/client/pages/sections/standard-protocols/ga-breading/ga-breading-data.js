export const gaBreadingData = {
  title: "Add a standard GA breeding protocol",
  description: "Select a protocol",
  groups: [
    {
      title: "GA breeding protocols for mice and rats",
      protocols: [
        {
          id: "superovulation",
          value: "superovulation",
          label: "Superovulation (mild)",
          data: {
            title: "Superovulation",
            severity: "mild",
            species: ["mice"],
            speciesDetails: [
              {
                id: "superovulation-mice-1",
                name: "Mice",
                value: "mice",
                lifeStages: ["adult", "juvenile"],
                maximumAnimals: "10",
                maximumTimesUsed: "1",
                reuse: ["no"]
              }
            ],
            description: {
              object: "value",
              document: {
                object: "document",
                data: {},
                nodes: [
                  {
                    object: "block",
                    type: "paragraph",
                    data: {},
                    nodes: [
                      {
                        object: "text",
                        text: "Standard superovulation protocol for mice.",
                        marks: []
                      }
                    ]
                  }
                ]
              }
            },
            "severity-details": {
              object: "value",
              document: {
                object: "document",
                data: {},
                nodes: [
                  {
                    object: "block",
                    type: "paragraph",
                    data: {},
                    nodes: [
                      {
                        object: "text",
                        text: "Mild severity procedure for superovulation.",
                        marks: []
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        {
          id: "rodent-breeding-mild",
          value: "rodent-breeding-mild",
          label: "Breeding and maintenance of genetically altered rodents (mild)",
          data: {
            title: "Breeding and maintenance of genetically altered rodents",
            severity: "mild",
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
            description: {
              object: "value",
              document: {
                object: "document",
                data: {},
                nodes: [
                  {
                    object: "block",
                    type: "paragraph",
                    data: {},
                    nodes: [
                      {
                        object: "text",
                        text: "Standard breeding protocol for genetically altered mice.",
                        marks: []
                      }
                    ]
                  }
                ]
              }
            },
            "severity-details": {
              object: "value",
              document: {
                object: "document",
                data: {},
                nodes: [
                  {
                    object: "block",
                    type: "paragraph",
                    data: {},
                    nodes: [
                      {
                        object: "text",
                        text: "Mild severity breeding protocol.",
                        marks: []
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        {
          id: "rodent-breeding-moderate",
          value: "rodent-breeding-moderate",
          label: "Breeding and maintenance of genetically altered rodents (moderate)",
          data: {
            title: "Breeding and maintenance of genetically altered rodents",
            severity: "moderate",
            species: ["mice"],
            speciesDetails: [
              {
                id: "breeding-mice-moderate-1",
                name: "Mice",
                value: "mice",
                lifeStages: ["embryo", "neonate", "juvenile", "adult", "pregnant", "aged"],
                maximumAnimals: "15",
                maximumTimesUsed: "1",
                reuse: ["no"]
              }
            ],
            description: {
              object: "value",
              document: {
                object: "document",
                data: {},
                nodes: [
                  {
                    object: "block",
                    type: "paragraph",
                    data: {},
                    nodes: [
                      {
                        object: "text",
                        text: "Moderate severity breeding protocol for genetically altered mice.",
                        marks: []
                      }
                    ]
                  }
                ]
              }
            },
            "severity-details": {
              object: "value",
              document: {
                object: "document",
                data: {},
                nodes: [
                  {
                    object: "block",
                    type: "paragraph",
                    data: {},
                    nodes: [
                      {
                        object: "text",
                        text: "Moderate severity breeding protocol with additional monitoring requirements.",
                        marks: []
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      ]
    },
    {
      title: "GA zebrafish breeding protocols",
      protocols: [
        {
          id: "breeding-mild-fish",
          value: "breeding-mild-fish",
          label: "Breeding and maintenance of genetically altered zebrafish (mild)",
          data: {
            title: "Breeding and maintenance of genetically altered zebrafish",
            severity: "mild",
            species: ["zebrafish"],
            speciesDetails: [
              {
                id: "breeding-zebrafish-1",
                name: "Zebrafish",
                value: "zebrafish",
                lifeStages: ["juvenile", "adult"],
                maximumAnimals: "50",
                maximumTimesUsed: "1",
                reuse: ["no"]
              }
            ],
            description: {
              object: "value",
              document: {
                object: "document",
                data: {},
                nodes: [
                  {
                    object: "block",
                    type: "paragraph",
                    data: {},
                    nodes: [
                      {
                        object: "text",
                        text: "Standard breeding protocol for genetically altered zebrafish.",
                        marks: []
                      }
                    ]
                  }
                ]
              }
            },
            "severity-details": {
              object: "value",
              document: {
                object: "document",
                data: {},
                nodes: [
                  {
                    object: "block",
                    type: "paragraph",
                    data: {},
                    nodes: [
                      {
                        object: "text",
                        text: "Mild severity zebrafish breeding protocol.",
                        marks: []
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      ]
    }
  ]
};

// Helper to match the exact structure of existing protocols
export const getProtocolData = (protocolValue, generateId = false) => {
  for (const group of gaBreadingData.groups) {
    const protocol = group.protocols.find(p => p.value === protocolValue);
    if (protocol) {
      const data = { ...protocol.data };

      // Add required fields that exist in real protocols
      data.complete = false;
      data.locations = ["University of Croydon"]; // Default location
      data.conditions = [];
      data.steps = [{ id: `step-${Date.now()}` }]; // Placeholder step

      // Generate new ID if requested (for new protocols)
      if (generateId) {
        data.id = `standard-protocol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      return data;
    }
  }
  return null;
};

// Alternative: Factory function to create protocol with proper structure
export const createStandardProtocol = (protocolValue, customizations = {}) => {
  const baseData = getProtocolData(protocolValue, true);
  if (!baseData) return null;

  return {
    ...baseData,
    ...customizations,
    _standardProtocol: true,
    _source: protocolValue,
    _created: new Date().toISOString()
  };
};
