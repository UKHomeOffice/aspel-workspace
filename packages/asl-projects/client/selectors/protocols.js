import { createSelector } from 'reselect';

export const getEnhancedProtocols = createSelector(
  project => project.protocols || [],
  (protocols) => {

    // Decorate protocols with additional properties
    return protocols.map(protocol => {
    if (!protocol) {
      return null; // or some default object
    }
    return {
      ...protocol,

      displayTitle: protocol.title || 'Untitled Protocol',
      isStandardProtocol: protocol.isStandardProtocol === true
    }
    });
  }
);
