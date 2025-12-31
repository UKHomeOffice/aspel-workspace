import { CLEAR_PROTOCOL_SELECTION, SAVE_PROTOCOL_DATA, SELECT_PROTOCOL } from '../actions/types';

const initialState = {
  selectedProtocol: null,
  protocolData: null,
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
    case CLEAR_PROTOCOL_SELECTION:
      return initialState;
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
