import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import ChangedBadge from './changed-badge';

const changeFields = (step, prefix) => step.reusable ? [`reusableSteps.${step.reusableStepId}`] : [prefix.substr(0, prefix.length - 1)];

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
        {/* The prop onlyChildFieldChanges is intended to handle the following business case:

          "Show a 'Changed' badge only if specific properties of this Step have changed, but ignore it if the Step container itself is marked as 'changed'."

          In the audit logs/change history, sometimes a parent object (like a Step) is flagged as "modified" just because it was saved or reordered, even if the user didn't type new text into its fields.

          Without this prop: The badge might appear as a "false positive" when nothing visible changed.
          With this prop: The system ignores the match on the Step's own ID/path and checks specifically for changes to its children. */}
        <ChangedBadge fields={changeFields(props.fields, props.changeFieldPrefix)} protocolId={props.protocolId} onlyChildFieldChanges={true} />
        {move}
      </>
    );
  } else if (previous.includes(props.protocolId)) {
    return <span className={classnames('badge created')}>new</span>;
  } else {
    return <></>;
  }
}
