// selectors/protocols.js - SIMPLE TEST
import { createSelector } from 'reselect';

export const getEnhancedProtocols = createSelector(
  state => state.project.protocols || [],
  state => state.protocols || {},

  (projectProtocols, protocolState) => {
    // SINGLE DIAGNOSTIC ALERT
    const isStandard = protocolState.protocolType === 'standard';
    const hasData = !!protocolState.protocolData;
    const hasId = !!protocolState.selectedProtocol;
    const alreadyExists = projectProtocols.some(p => p.id === protocolState.selectedProtocol);

    if (isStandard && hasData && hasId && !alreadyExists) {
      alert(`✅ READY TO INJECT STANDARD PROTOCOL:
        • ID: ${protocolState.selectedProtocol}
        • Title: ${protocolState.protocolData.title || 'No title'}
        • Current protocols: ${projectProtocols.length}
        • Will add new protocol
      `);

      return [...projectProtocols, {
        ...protocolState.protocolData,
        id: protocolState.selectedProtocol,
        complete: false,
        _isStandardProtocol: true,
        protocolType: 'standard'
      }];
    }

    return projectProtocols;
  }
);
