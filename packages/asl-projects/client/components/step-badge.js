import React from 'react';
import { useSelector } from 'react-redux';
import ChangedBadge from './changed-badge';

export default function StepBadge(props) {
  const { previous, steps, firstSteps, grantedSteps } = useSelector(state => state.application.previousProtocols);
  if (!previous || !steps || !firstSteps || !grantedSteps) {
    return null;
  }

  let stepIds = [];
  let previousIndex = -1;
  steps.forEach(protocol => {
    protocol.forEach((step, i) => {
      if (step.id === props.fields.id && props.position !== i) {
        previousIndex = i;
      }
      stepIds.push(step.id);
    });
  });

  let grantedIndex = -1;
  let grantedStepIds = [];
  grantedSteps.forEach(protocol => {
    protocol.forEach((step, i) => {
      if (step.id === props.fields.id && props.position !== i) {
        grantedIndex = i;
      }
      grantedStepIds.push(step.id);
    });
  });

  let firstIndex = -1;
  let firstStepIds = [];
  firstSteps.forEach(protocol => {
    protocol.forEach((step, i) => {
      if (step.id === props.fields.id && props.position !== i) {
        firstIndex = i;
      }
      firstStepIds.push(step.id);
    });
  });

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
