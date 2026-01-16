// constants/protocol-types.js
export const PROTOCOL_TYPES = {
  EXPERIMENTAL: 'experimental',
  STANDARD: 'standard',
  EDITABLE: 'editable'
};

export const PROTOCOL_CONFIG = {
  [PROTOCOL_TYPES.EXPERIMENTAL]: {
    title: 'Experimental Protocol',
    isEditable: true,
    isPrefilled: false,
    defaultData: {
      steps: [],
      animals: {},
      conditions: [],
      locations: []
    }
  },
  [PROTOCOL_TYPES.STANDARD]: {
    title: 'Standard Protocol',
    isEditable: false, // READ-ONLY
    isPrefilled: true,
    defaultData: {} // Will be filled from template
  },
  [PROTOCOL_TYPES.EDITABLE]: {
    title: 'Editable Template Protocol',
    isEditable: true,
    isPrefilled: true,
    defaultData: {
      steps: [{ id: 'step-1', title: 'Step 1', description: '' }],
      animals: { species: [], count: 0 },
      conditions: [],
      locations: []
    }
  }
};
