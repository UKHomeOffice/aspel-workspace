import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import minimatch from 'minimatch';

export const hasMatchingChange = (fields, changes) => {
  if (!changes?.length || !fields?.length) {
    return false;
  }

  for (const field of fields) {
    for (const change of changes) {
      if (minimatch(change, field)) {
        return true;
      }
    }
  }

  return false;
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
  if ((changedFromGranted || hasMatchingChange(fields, granted)) && protocolAllowed(previousProtocols.granted)) {
    return <span className="badge">{noLabel ? '' : 'amended'}</span>;
  }
  if ((changedFromFirst || hasMatchingChange(fields, first)) && protocolAllowed(previousProtocols.first)) {
    return <span className="badge">{noLabel ? '' : 'changed'}</span>;
  }

  return null;
}
