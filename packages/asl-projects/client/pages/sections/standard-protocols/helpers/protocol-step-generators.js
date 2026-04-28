// Central registry for protocol step generators

const protocolStepGenerators = {
  'rodent-breeding-mild': (isStandard = false) => [
    {
      title: `The production and birth of GA offspring is permitted using either of the following methods:\n      \n• breeding by conventional methods\n      \n• generation of GA embryos by in vitro manipulation and/or fertilisation, followed by development in an embryo recipient (the GA embryos are covered in this protocol, whereas the embryo recipients are covered in the ‘Embryo recipients’ protocol)`,
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
      title: `See General constraints.\n      \nThe method used to determine genetic status will be the least invasive and is only expected to cause short-term pain, suffering or distress and no lasting harm - for example, ear biopsy, blood sampling or non-invasive imaging (AA/AB).\n      \nWhere possible, sampling will be carried out at the earliest feasible life stage. A second sample will only be taken in rare cases where there are technical problems during analysis.\n      \nNVS advice will be followed regarding the use of analgesia.`,
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
      title: `Substances to suppress the harmful phenotype, for example doxycycline or other compounds, may be administered by one of the following routes:\n      \n• oral, including in diet or water, or by oral gavage (AA/AB)\n      \n• intraperitoneal (AA/AB)\n      \n• subcutaneous (AA/AB)`,
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
      title: `Animals may be killed using either of the following methods:\n      \n• a Schedule 1 method\n      \n• a non-Schedule 1 method under non-recovery anaesthesia, followed by a Schedule 1 completion method`,
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
  ]
  // Add more protocol types here as needed
};

export function getPrefilledStepsForProtocol(protocolName, isStandard = false) {
  const generator = protocolStepGenerators[protocolName];
  return generator ? generator(isStandard) : [];
}

export { protocolStepGenerators };
