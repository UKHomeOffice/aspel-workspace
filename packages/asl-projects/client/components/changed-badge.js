import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import minimatch from 'minimatch';

export default function ChangedBadge({ fields = [], changedFromGranted, changedFromLatest, changedFromFirst, noLabel }) {
  const latestChanges = useSelector(state => state.changes?.latest || [], shallowEqual);
  const grantedChanges = useSelector(state => state.changes?.granted || [], shallowEqual);
  const firstChanges = useSelector(state => state.changes?.first || [], shallowEqual);

  const latestAdded = useSelector(state => state.added?.latest || [], shallowEqual);
  const grantedAdded = useSelector(state => state.added?.granted || [], shallowEqual);
  const firstAdded = useSelector(state => state.added?.first || [], shallowEqual);

  const sourceIncludes = source => {
    return source.length && fields.some(field => {
      return source.some(change => minimatch(change, field));
    });
  };

  const protocolId = fields.find(f => /^protocols\.[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}\./.test(f))?.split('.')[1];
  const stepId = fields.find(f => /^protocols\.[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}\.steps\.[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}\./.test(f))?.split('.')[3];

  const parentAddedFrom = (source) => {
    return source.includes(`protocols.${protocolId}`) || source.includes(`protocols.${protocolId}.steps.${stepId}`);
  };

  if (changedFromLatest || sourceIncludes(latestChanges)) {
    if (parentAddedFrom(latestAdded)) {
      return null
    } else if (sourceIncludes(latestAdded)) {
      return <span className="badge changed">{noLabel ? '' : 'new'}</span>;
    } else {
      return <span className="badge changed">{noLabel ? '' : 'changed'}</span>;
    }
  }

  if (changedFromGranted || sourceIncludes(grantedChanges)) {
    if (parentAddedFrom(grantedAdded)) {
      return null
    } else if (sourceIncludes(grantedAdded)) {
      return <span className="badge">{noLabel ? '' : 'added'}</span>;
    } else {
      return <span className="badge">{noLabel ? '' : 'amended'}</span>;
    }
  }

  if (changedFromFirst || sourceIncludes(firstChanges)) {
    if (parentAddedFrom(firstAdded)) {
      return null
    } else if (sourceIncludes(firstAdded)) {
      return <span className="badge">{noLabel ? '' : 'added'}</span>;
    } else {
      return <span className="badge">{noLabel ? '' : 'changed'}</span>;
    }
  }

  return null;
}
