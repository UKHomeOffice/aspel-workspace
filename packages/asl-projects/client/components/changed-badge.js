import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import minimatch from 'minimatch';
import { changedFrom } from '../helpers/changed-badge-helper';

export default function ChangedBadge({ fields = [], changedFromGranted, changedFromLatest, changedFromFirst, protocolId, noLabel, ignoreExactMatch = false }) {
  const latest = useSelector(state => state.changes?.latest || [], shallowEqual);
  const granted = useSelector(state => state.changes?.granted || [], shallowEqual);
  const first = useSelector(state => state.changes?.first || [], shallowEqual);
  const previousProtocols = useSelector(state => state.application?.previousProtocols || {}, shallowEqual);

  if ((changedFromLatest || changedFrom(fields, latest, protocolId, ignoreExactMatch)) && (!protocolId || previousProtocols.previous?.includes(protocolId))) {
    return <span className="badge changed">{noLabel ? '' : 'changed'}</span>;
  }
  if ((changedFromGranted || changedFrom(fields, granted, protocolId, ignoreExactMatch)) && (!protocolId || previousProtocols.granted?.includes(protocolId))) {
    return <span className="badge">{noLabel ? '' : 'amended'}</span>;
  }
  if ((changedFromFirst || changedFrom(fields, first, protocolId, ignoreExactMatch)) && (!protocolId || previousProtocols.first?.includes(protocolId))) {
    return <span className="badge">{noLabel ? '' : 'changed'}</span>;
  }

  return null;
}
