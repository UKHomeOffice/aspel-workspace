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
            hello: "world",
          }
        },
        {
          id: "embryo-recipients",
          value: "embryo-recipients",
          label: "Embryo recipients (moderate)",
          data: {
            hello: "world",
          }
        },
        {
          id: "vasectomy",
          value: "vasectomy",
          label: "Vasectomy (moderate)",
          data: {
            hello: "world",
          }
        },
        {
          id: "rodent-breeding-mild",
          value: "rodent-breeding-mild",
          label: "Breeding and maintenance of genetically altered rodents (mild)",
          data: {
            hello: "world",
          }
        },
        {
          id: "rodent-breeding-moderate",
          value: "rodent-breeding-moderate",
          label: "Breeding and maintenance of genetically altered rodents (moderate)",
          data: {
            hello: "world",
          }
        }
      ]
    },
    {
      title: "GA zebrafish breeding protocols",
      protocols: [
        {
          id: "obtaining-gametes",
          value: "obtaining-gametes",
          label: "Gamete collection (mild)",
          data: {
            hello: "world",
          }
        },
        {
          id: "breeding-mild-fish",
          value: "breeding-mild-fish",
          label: "Breeding and maintenance of genetically altered zebrafish (mild)",
          data: {
            hello: "world",
          }
        },
        {
          id: "breeding-moderate-fish",
          value: "breeding-moderate-fish",
          label: "Breeding and maintenance of genetically altered zebrafish (moderate)",
          data: {
            hello: "world",
          }
        }
      ]
    }
  ]
};

export const getProtocolData = (protocolValue) => {
  for (const group of gaBreadingData.groups) {
    const protocol = group.protocols.find(p => p.value === protocolValue);
    if (protocol) {
      return protocol;
    }
  }
  return null;
};
