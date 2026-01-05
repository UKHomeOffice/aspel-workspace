import {
  CREATE_PROTOCOL,
  SELECT_PROTOCOL,
  CLEAR_PROTOCOL_SELECTION,
  SAVE_PROTOCOL_DATA,
  UPDATE_PROTOCOL,
  ADD_PROTOCOL
} from '../actions/types';

const initialState = {
  selectedProtocol: null,
  protocolData: null,
  protocolType: null,
  userInput: {},
  isDirty: false
};

export default function protocolsReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_PROTOCOL:
      return {
        ...state,
        selectedProtocol: action.payload.protocolId,
        protocolData: action.payload.protocolData,
        protocolType: action.payload.protocolType,
        isDirty: true
      };

    case CREATE_PROTOCOL:
      return {
        ...state,
        createdProtocols: [...state.createdProtocols, action.payload],
        selectedProtocol: action.payload.id,
        protocolData: action.payload,
        protocolType: action.payload._protocolType || 'experimental',
        isDirty: true
      };

    case UPDATE_PROTOCOL: {
      const { id, updates } = action.payload;
      return {
        ...state,
        allProtocols: {
          ...state.allProtocols,
          [id]: {
            ...state.allProtocols[id],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      };
    }

    case CLEAR_PROTOCOL_SELECTION:
      return {
        ...state,
        selectedProtocolId: null
      };

    case SAVE_PROTOCOL_DATA:
      return state;

    default:
      return state;
  }
}
