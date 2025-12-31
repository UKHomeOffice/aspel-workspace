import { CLEAR_PROTOCOL_SELECTION, SAVE_PROTOCOL_DATA, SELECT_PROTOCOL } from './types';

export const selectProtocol = (protocolType, protocolId, protocolData) => ({
  type: SELECT_PROTOCOL,
  payload: { protocolType, protocolId, protocolData }
});

export const clearProtocolSelection = () => ({
  type: CLEAR_PROTOCOL_SELECTION
});

export const saveProtocolData = (data) => ({
  type: SAVE_PROTOCOL_DATA,
  payload: data
});
