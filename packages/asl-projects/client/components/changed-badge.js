import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import minimatch from 'minimatch';

// returns true if a string looks like it contains a UUID
const hasUuid = str => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(str);

function stripPrefixItemsKeepingFirstTwo(arr) {
  if (arr.length <= 2) return arr;

  const head = arr.slice(0, 2);
  const tail = arr.slice(2);

  let lastNonUuidIndex = -1;
  tail.forEach((item, idx) => {
    if (!hasUuid(item)) lastNonUuidIndex = idx;
  });

  if (lastNonUuidIndex === -1) return arr;

  const cleanedTail = tail.slice(lastNonUuidIndex + 1);
  return head.concat(cleanedTail);
}

export const hasMatchingChange = (fields, changes) => {
  if (!fields?.length || !changes?.length) {
    return false;
  }

  return fields.some(field => {
    const cleaned = stripPrefixItemsKeepingFirstTwo(changes);
    return cleaned.some(item => {
      return minimatch(item, field);
    });
  });
};

export default function ChangedBadge({ fields = [], changedFromGranted, changedFromLatest, changedFromFirst, protocolId, noLabel }) {
  const latest = useSelector(state => state.changes?.latest || [], shallowEqual);
  const granted = useSelector(state => state.changes?.granted || [], shallowEqual);
  const first = useSelector(state => state.changes?.first || [], shallowEqual);
  const previousProtocols = useSelector(state => state.application?.previousProtocols || {}, shallowEqual);

  const protocolAllowed = (list) => !protocolId || list?.includes(protocolId);

  if ((changedFromLatest || hasMatchingChange(fields, latest)) && protocolAllowed(previousProtocols.previous)) {
    return <span className="badge changed">{noLabel ? '' : 'changed'}</span>;
  }
  if ((changedFromGranted || hasMatchingChange(fields, granted, 'granted')) && protocolAllowed(previousProtocols.granted)) {
    return <span className="badge">{noLabel ? '' : 'amended'}</span>;
  }
  if ((changedFromFirst || hasMatchingChange(fields, first)) && protocolAllowed(previousProtocols.first)) {
    return <span className="badge">{noLabel ? '' : 'changed'}</span>;
  }

  return null;
}
