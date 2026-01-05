// reducers/protocols.js - STORE ALL PROTOCOLS
import {
  CLEAR_PROTOCOL_SELECTION,
  SAVE_PROTOCOL_DATA,
  SELECT_PROTOCOL,
  CREATE_PROTOCOL
} from '../actions/types';

const initialState = {
  // Store ALL created protocols here
  allProtocols: {}, // protocolId -> protocolData
  // Current selection
  selectedProtocol: null,
  protocolType: null,
  userInput: {},
  isDirty: false
};

export default function protocolsReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_PROTOCOL:
      const { protocolType, protocolId, protocolData } = action.payload;

      // DEEP COPY protocolData
      const safeProtocolData = protocolData ? JSON.parse(JSON.stringify(protocolData)) : null;

      return {
        ...state,
        // Add to allProtocols
        allProtocols: {
          ...state.allProtocols,
          [protocolId]: safeProtocolData
        },
        selectedProtocol: protocolId,
        protocolType: protocolType,
        isDirty: true
      };

    case CREATE_PROTOCOL:
      const newProtocol = action.payload;
      return {
        ...state,
        allProtocols: {
          ...state.allProtocols,
          [newProtocol.id]: newProtocol
        },
        selectedProtocol: newProtocol.id,
        protocolType: newProtocol.protocolType || 'experimental',
        isDirty: true
      };

    case CLEAR_PROTOCOL_SELECTION:
      return {
        ...state,
        selectedProtocol: null,
        protocolType: null
      };

    case SAVE_PROTOCOL_DATA:
      return {
        ...state,
        userInput: action.payload,
        isDirty: true
      };

    default:
      return state;
  }
}
