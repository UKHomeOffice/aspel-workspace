import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import minimatch from 'minimatch';

export default function ChangedBadge({ fields = [], changedFromGranted, changedFromLatest, changedFromFirst, protocolId, noLabel }) {
  const latest = useSelector(state => state.changes?.latest || [], shallowEqual);
  const granted = useSelector(state => state.changes?.granted || [], shallowEqual);
  const first = useSelector(state => state.changes?.first || [], shallowEqual);
  const previousProtocols = useSelector(state => state.application?.previousProtocols || {}, shallowEqual);

  const changedFrom = source => {
    //Protocol, removing config fields, which causing false change badge showing up
    let cleanedSource;
    if (protocolId) {
      cleanedSource = source.filter(item =>
        !item.endsWith('usedInProtocols') &&
        !item.endsWith('reusedStep') &&
        !item.endsWith('reusableStepId') &&
        !item.endsWith('usedInProtocols.protocolId') &&
        !item.endsWith('usedInProtocols.protocolNumber')
      );
      cleanedSource = cleanedSource.filter((item, _, arr) => {
        // Check if it ends with any of the fields
        const endsWithTarget = fields.some(field => item.endsWith(field));

        // Check if this item is a substring of any other item in the array
        const isContainedElsewhere = arr.some(other => other !== item && other.includes(item));

        // Keep it if it doesn't end with field OR it's contained elsewhere
        return !endsWithTarget || isContainedElsewhere;
      });
    } else {
      cleanedSource = source;
    }
    return cleanedSource.length && fields.some(field => {
      return cleanedSource.some(change => minimatch(change, field));
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
