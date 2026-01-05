import { v4 as uuidv4 } from 'uuid';

// NEW: Create protocol action (doesn't interfere with existing selectProtocol)
export const createProtocol = (protocolType, templateData = null) => {
  const protocolId = `protocol-${uuidv4()}`;

  let protocolData;

  if (protocolType === 'standard' && templateData) {
    // Standard protocol with template
    protocolData = {
      ...templateData,
      id: protocolId,
      _isStandardProtocol: true,
      _protocolType: 'standard',
      complete: false
    };
  } else if (protocolType === 'editable') {
    // Editable template
    protocolData = {
      id: protocolId,
      title: 'Editable Template Protocol',
      _protocolType: 'editable',
      steps: [{ id: uuidv4(), title: 'Step 1', description: '' }],
      animals: {},
      conditions: [],
      locations: [],
      complete: false
    };
  } else {
    // Experimental (default)
    protocolData = {
      id: protocolId,
      title: 'Experimental Protocol',
      _protocolType: 'experimental',
      steps: [],
      animals: {},
      conditions: [],
      locations: [],
      complete: false
    };
  }

  return {
    type: 'CREATE_PROTOCOL',
    payload: protocolData
  };
};

// Keep existing actions UNCHANGED
export const selectProtocol = (protocolType, protocolId, protocolData) => ({
  type: 'SELECT_PROTOCOL',
  payload: { protocolType, protocolId, protocolData }
});
