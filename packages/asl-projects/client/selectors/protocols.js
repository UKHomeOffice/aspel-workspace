import { createSelector } from 'reselect';

export const getEnhancedProtocols = createSelector(
  state => state.project.protocols || [],
  (projectProtocols) => {
    // Debug logging (remove alerts in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Protocols selector:', {
        count: projectProtocols.length,
        protocols: projectProtocols.map(p => ({
          id: p.id,
          title: p.title || 'Untitled',
          isStandard: p._isStandardProtocol || false
        }))
      });
    }

    return projectProtocols;
  }
);

// Optional: Create additional selectors if needed
export const getProtocolCount = createSelector(
  state => state.project.protocols || [],
  (protocols) => protocols.length
);

export const getStandardProtocols = createSelector(
  state => state.project.protocols || [],
  (protocols) => protocols.filter(p => p._isStandardProtocol === true)
);

export const getNonStandardProtocols = createSelector(
  state => state.project.protocols || [],
  (protocols) => protocols.filter(p => !p._isStandardProtocol)
);
