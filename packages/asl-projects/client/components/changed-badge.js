import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import minimatch from 'minimatch';

export default function ChangedBadge({ fields = [], changedFromGranted, changedFromLatest, changedFromFirst, protocolId, noLabel }) {
  const latest = useSelector(state => state.changes?.latest || [], shallowEqual);
  const granted = useSelector(state => state.changes?.granted || [], shallowEqual);
  const first = useSelector(state => state.changes?.first || [], shallowEqual);
  const previousProtocols = useSelector(state => state.application?.previousProtocols || {}, shallowEqual);

  const changedFrom = source => {
    return source.length && fields.some(field => {
      return source.some(change => minimatch(change, field));
    });
  };

  if ((changedFromLatest || changedFrom(latest)) && (!protocolId || previousProtocols.previous?.includes(protocolId))) {
    return <span className="badge changed">{noLabel ? '' : 'changed'}</span>;
  }
  if ((changedFromGranted || changedFrom(granted)) && (!protocolId || previousProtocols.granted?.includes(protocolId))) {
    return <span className="badge">{noLabel ? '' : 'amended'}</span>;
  }
  if ((changedFromFirst || changedFrom(first)) && (!protocolId || previousProtocols.first?.includes(protocolId))) {
    return <span className="badge">{noLabel ? '' : 'changed'}</span>;
  }

  return null;
}
