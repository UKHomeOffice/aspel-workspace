export const gaBreadingData = (isStandard = true) => ({
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
            isStandardProtocol: isStandard,
            standardProtocolType: isStandard ? 'standard-ga-breeding' : 'editable-ga-breeding',
            severity: "mild",
            "severity-proportion": "All animals may experience mild discomfort during hormone administration.",
            "severity-details": "Mild severity due to transient discomfort from hormone injections and surgical procedures.",

            // Protocol details
            description: "Standard superovulation protocol for production of multiple oocytes from female mice for embryo collection and genetic modification.",
            locations: [
              {
                establishmentId: "est-lab-001",
                establishmentName: "University Genetics Lab",
                poles: ["Pole A", "Pole B"]
              }
            ],
            objectives: ["obj-breeding-001", "obj-ga-mice-002"],

            // Animals section
            species: ["mice"],
            speciesDetails: [
              {
                id: "superovulation-mice-1",
                name: "Mice",
                value: "mice",
                species: ["mice"],
                speciesLabel: "mice",
                lifeStages: ["embryo", "adult", "pregnant"],
                maximumAnimals: "10",
                "maximum-animals": "10",
                "life-stages": ["embryo", "adult", "pregnant"],
                "continued-use": false,
                "continued-use-sourced": "",
                reuse: ["no"],
                "maximum-times-used": "",
                "reuse-details": ""
              }
            ],

            // GAA section
            gaas: true,
            "gaas-types": "Will use wild-type mice for superovulation to produce oocytes for subsequent genetic modification procedures.",
            "gaas-harmful": false,
            "gaas-harmful-justification": "",
            "gaas-harmful-control": "",

            // Steps section
            steps: [
              {
                id: "step-superov-1",
                title: "Hormone administration via intraperitoneal injection",
                reference: "Hormone injection",
                optional: false,
                adverse: true,
                "adverse-effects": "Mild abdominal discomfort post-injection, transient.",
                "prevent-adverse-effects": "Use aseptic technique, appropriate needle size, gentle handling.",
                endpoints: "Signs of persistent distress, infection at injection site.",
                reusable: true
              },
              {
                id: "step-superov-2",
                title: "Euthanasia and oocyte collection",
                reference: "Oocyte collection",
                optional: false,
                adverse: false,
                reusable: true
              }
            ],

            // Fate of animals
            fate: ["killed", "tissue-taken"],

            // Animal experience
            "experience-summary": "Females receive hormone injections, mate with males, then are euthanized for oocyte collection. Entire process completed within 5 days.",
            "experience-endpoints": "Humane endpoints include signs of severe distress post-injection or during mating. Animals euthanized by schedule 1 method.",

            // Experimental design
            outputs: "Multiple oocytes for in vitro fertilization and genetic modification.",
            "quantitative-data": false,

            // Protocol justification
            "most-appropriate": "Superovulation maximizes oocyte yield from minimal number of donor females, reducing overall animal use.",
            "most-refined": "Using established hormone regimens and gentle handling techniques to minimize stress.",
            "scientific-endpoints": "Oocyte quality requires specific timing of collection post-hormone administration.",
            "scientific-suffering": "Minimal suffering necessary to obtain viable oocytes for genetic studies.",
            "scientific-endpoints-justification": "Earlier endpoints would prevent collection of mature oocytes required for successful genetic modification.",
            "justification-substances": true,
            "substances-suitibility": "Hormones assessed for purity and biological activity. Doses based on established protocols for mouse strain.",
            "dosing-regimen": "Pregnant mare serum gonadotropin (5IU) followed 48h later by human chorionic gonadotropin (5IU), both IP."
          }
        },
        {
          id: "rodent-breeding-mild",
          value: "rodent-breeding-mild",
          label: "Breeding and maintenance of genetically altered rodents (mild)",
          data: {
            title: "Breeding and maintenance of genetically altered rodents",
            isStandardProtocol: isStandard,
            standardProtocolType: isStandard ? 'standard-ga-breeding' : 'editable-ga-breeding',
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
            description: "Standard breeding protocol for genetically altered mice.",
            "severity-details": "Mild severity breeding protocol."
          }
        },
        {
          id: "rodent-breeding-moderate",
          value: "rodent-breeding-moderate",
          label: "Breeding and maintenance of genetically altered rodents (moderate)",
          data: {
            isStandardProtocol: isStandard,
            standardProtocolType: isStandard ? 'standard-ga-breeding' : 'editable-ga-breeding',
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
            description: "Moderate severity breeding protocol for genetically altered mice.",
            "severity-details": "Moderate severity breeding protocol with additional monitoring requirements."
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
            isStandardProtocol: isStandard,
            standardProtocolType: isStandard ? 'standard-ga-breeding' : 'editable-ga-breeding',
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
            description: "Standard breeding protocol for genetically altered zebrafish.",
            "severity-details": "Mild severity zebrafish breeding protocol."
          }
        }
      ]
    }
  ]
});
