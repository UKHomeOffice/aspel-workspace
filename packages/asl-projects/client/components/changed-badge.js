import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import minimatch from 'minimatch';

export default function ChangedBadge({ primaryField, fields = [primaryField], changedFromGranted, changedFromLatest, changedFromFirst, noLabel }) {
  const latestChanges = useSelector(state => state.changes?.latest || [], shallowEqual);
  const grantedChanges = useSelector(state => state.changes?.granted || [], shallowEqual);
  const firstChanges = useSelector(state => state.changes?.first || [], shallowEqual);

  const latestAdded = useSelector(state => state.added?.latest || [], shallowEqual);
  const grantedAdded = useSelector(state => state.added?.granted || [], shallowEqual);
  const firstAdded = useSelector(state => state.added?.first || [], shallowEqual);

  const sourceIncludes = (source, fieldOverride) => {
    const fieldsToCheck = fieldOverride ? [fieldOverride] : fields;

    return source.length && fieldsToCheck.some(field => {
      return source.some(change => minimatch(change, field));
    });
  };

  // Extract the protocol and step uuids if they are part of the prefix of this
  // field, but not if they are an exact match for the field name. This way
  // the new badge still shows for the actual step or protocol that has been
  // added, but is hidden for nested fields.
  const protocolId = fields.find(f => /^protocols\.[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}\./.test(f))?.split('.')[1];
  const stepId = fields.find(f => /^protocols\.[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}\.steps\.[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}\./.test(f))?.split('.')[3];

  // If a protocol or step are new, a new/added badge is displayed at the
  // protocol or step level, and nested fields do not show a badge.
  const isParentProtocolOrStepInAdditions = (source) => {
    return (protocolId &&source.includes(`protocols.${protocolId}`))
      || (stepId && source.includes(`protocols.${protocolId}.steps.${stepId}`));
  };

  if (changedFromLatest || sourceIncludes(latestChanges)) {
    if (isParentProtocolOrStepInAdditions(latestAdded)) {
      return null
    } else if (sourceIncludes(latestAdded, primaryField)) {
      return <span className="badge changed">{noLabel ? '' : 'new'}</span>;
    } else {
      return <span className="badge changed">{noLabel ? '' : 'changed'}</span>;
    }
  }

  if (changedFromGranted || sourceIncludes(grantedChanges)) {
    if (isParentProtocolOrStepInAdditions(grantedAdded)) {
      return null
    } else if (sourceIncludes(grantedAdded, primaryField)) {
      return <span className="badge">{noLabel ? '' : 'added'}</span>;
    } else {
      return <span className="badge">{noLabel ? '' : 'amended'}</span>;
    }
  }

  if (changedFromFirst || sourceIncludes(firstChanges)) {
    if (isParentProtocolOrStepInAdditions(firstAdded)) {
      return null
    } else if (sourceIncludes(firstAdded, primaryField)) {
      return <span className="badge">{noLabel ? '' : 'added'}</span>;
    } else {
      return <span className="badge">{noLabel ? '' : 'changed'}</span>;
    }
  }

  return null;
}
