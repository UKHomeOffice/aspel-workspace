import { createSelector } from 'reselect';

export const getEnhancedProtocols = createSelector(
  state => state.project.protocols || [],
  state => state.protocols,

  (projectProtocols, protocolState) => {
    const shouldInject =
      protocolState.protocolType === 'standard' &&
      protocolState.protocolData &&
      protocolState.selectedProtocol;

    if (!shouldInject) {
      return projectProtocols;
    }

    const { protocolData, selectedProtocol } = protocolState;

    // Add new protocol to list
    return [...projectProtocols, {
      ...protocolData,
      id: selectedProtocol,
      complete: false
    }];
  }
);
