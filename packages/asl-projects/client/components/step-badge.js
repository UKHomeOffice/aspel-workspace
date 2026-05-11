import React from 'react';
import { useSelector } from 'react-redux';
import ChangedBadge from './changed-badge';

export default function StepBadge(props) {
  const { previous, steps, firstSteps, grantedSteps } = useSelector(state => state.application.previousProtocols);
  if (!previous || !steps || !firstSteps || !grantedSteps) {
    return null;
  }

  const collectSteps = (protocols = []) => {
    let index = -1;
    const ids = [];

    if (!Array.isArray(protocols)) {
      return { index, ids };
    }

    protocols.forEach((protocol, protocolIndex) => {

      if (!Array.isArray(protocol)) {
        return;
      }

      protocol.forEach((step, i) => {

        if (step?.id === props.fields.id && props.position !== i) {
          index = i;
        }

        if (step?.id) {
          ids.push(step.id);
        }
      });
    });

    return { index, ids };
  };

  const { index: previousIndex, ids: stepIds } = collectSteps(steps);
  const { index: grantedIndex, ids: grantedStepIds } = collectSteps(grantedSteps);
  const { index: firstIndex, ids: firstStepIds } = collectSteps(firstSteps);

  const field = props.changeFieldPrefix.substr(0, props.changeFieldPrefix.length - 1)

  if (stepIds.includes(props.fields.id) || grantedStepIds.includes(props.fields.id) || firstStepIds.includes(props.fields.id)) {
    let move;
    if (previousIndex !== -1) {
      move = <span className="badge reordered">{previousIndex > props.position ? 'Moved up' : 'Moved down'}</span>;
    } else if (grantedIndex !== -1) {
      move = <span className="badge">{grantedIndex > props.position ? 'Moved up' : 'Moved down'}</span>;
    } else if (!grantedSteps.length && firstIndex >= 0) {
      move = <span className="badge">{firstIndex > props.position ? 'Moved up' : 'Moved down'}</span>;
    }

    return (
      <>
        <ChangedBadge primaryField={field} />
        {move}
      </>
    );
  } else {
    return <ChangedBadge primaryField={field} />;
  }
}
