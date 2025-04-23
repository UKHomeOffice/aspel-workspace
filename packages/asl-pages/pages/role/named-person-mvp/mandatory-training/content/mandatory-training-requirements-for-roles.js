const E1 = { content: ['2. Ethics, animal welfare and the 3Rs (level 1)'] };
const E2 = { content: ['9. Ethics, animal welfare and the 3Rs (level 2)'] };
const L = { content: ['1. Legislation'] };
const K = { content: ['6.1 Humane methods of killing (theory)'] };
const PILA_THEORY = {
  tag: 'Species specific',
  content: [
    '3.1 Basic and appropriate biology',
    '4. Animal care, health and management',
    '5. Recognition of pain, suffering and distress',
    '7. Minimally invasive procedures without anaesthesia'
  ]
};
const PILA_SKILLS = {
  tag: 'Species specific',
  content: [
    '3.2 Basic and appropriate biology',
    '8. Minimally invasive procedures without anaesthesia'
  ]
};

const mandatoryTrainingRequirementsForRoles = {
  nacwo: {
    title: 'NACWO mandatory training requirements',
    modules: {
      L,
      E1,
      'PILA (theory)': PILA_THEORY,
      'PILA (skills)': PILA_SKILLS,
      'K (theory)': K,
      E2,
      NACWO: {
        content: ['23. Animal husbandry, care and enrichment practices']
      }
    },
    additional: {
      title:
        'Mandatory training if working in areas where anaesthesia and surgery is carried out',
      modules: {
        PILB: { content: ['20. Anaesthesia for minor procedures'] },
        PILC: {
          content: [
            '21. Advanced anaesthesia, for example for surgical procedures',
            '22. Principles of surgery'
          ]
        }
      }
    }
  },
  nvs: {
    title: 'NVS mandatory training',
    modules: {
      L,
      E1,
      'K (theory)': K,
      E2,
      NVS: {
        content: [
          '24. Basic principles of veterinary care of animals used for research. Module must be approved by the RCVS'
        ]
      }
    },
    additional: {
      title: `Nominees will only need to complete the following modules if they do not already have experience with the species they'll be responsible for.`,
      modules: {
        'PILA (theory)': PILA_THEORY,
        'PILA (skills)': PILA_SKILLS,
        'K (skills)': {
          tag: 'Species specific',
          content: [
            '3.2 Basic and appropriate biology',
            '8. Minimally invasive procedures without anaesthesia'
          ]
        }
      }
    }
  }
};

module.exports = mandatoryTrainingRequirementsForRoles;
