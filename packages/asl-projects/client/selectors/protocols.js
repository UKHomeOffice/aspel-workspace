// selectors/protocols.js - DEBUG VERSION
import { createSelector } from 'reselect';

export const getEnhancedProtocols = createSelector(
  state => state.project.protocols || [],
  state => state.protocols?.allProtocols || {},

  (projectProtocols, allProtocols) => {
    const createdProtocols = Object.values(allProtocols);

    alert(`🔍 SELECTOR DEBUG:
      • Project protocols: ${projectProtocols.length}
      • Created protocols: ${createdProtocols.length}
      • All protocol IDs: ${createdProtocols.map(p => p.id).join(', ')}
    `);

    // Merge logic
    const protocols = [...projectProtocols];
    const existingIds = new Set(projectProtocols.map(p => p.id));

    createdProtocols.forEach(protocol => {
      if (protocol?.id && !existingIds.has(protocol.id)) {
        protocols.push(protocol);
      }
    });

    alert(`✅ MERGED: ${protocols.length} total protocols`);

    return protocols;
  }
);
