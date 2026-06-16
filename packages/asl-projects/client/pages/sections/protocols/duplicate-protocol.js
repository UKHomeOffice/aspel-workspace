export const getDuplicatedProtocols = (items = [], duplicatedId) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map(item => {
    if (item.id === duplicatedId) {
      return {
        ...item,
        title: `${item.title} (Copy)`,
        complete: false
      };
    }
    return item;
  });
};

export const getProtocolSelector = protocolId => `.protocols-section .protocol[data-protocol-id="${protocolId}"]`;

export const scrollToProtocolById = protocolId => {
  if (!protocolId || typeof document === 'undefined' || typeof window === 'undefined') {
    return false;
  }

  const protocol = document.querySelector(getProtocolSelector(protocolId));
  const offsetTop = protocol?.offsetTop;

  if (typeof offsetTop !== 'number') {
    return false;
  }

  window.scrollTo({
    top: offsetTop,
    left: 0
  });

  return true;
};

export const scheduleProtocolScroll = protocolId => {
  if (!protocolId || typeof window === 'undefined') {
    return false;
  }

  const schedule = window.requestAnimationFrame || (callback => window.setTimeout(callback, 0));
  schedule(() => scrollToProtocolById(protocolId));

  return true;
};

