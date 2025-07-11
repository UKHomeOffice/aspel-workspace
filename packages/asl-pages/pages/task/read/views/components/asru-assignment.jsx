import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Fieldset } from '@ukhomeoffice/asl-components';

export default function AsruAssignment() {
  const { url, user, assignmentSchema } = useSelector(state => state.static);
  const assignedTo = useSelector(state => state.static.task.assignedTo);
  const assignedToMe = assignedTo && assignedTo.id === user.id;

  const [disabled, setDisabled] = useState(false);

  const onFormSubmit = e => {
    if (disabled) {
      e.preventDefault();
    }
    e.persist();
    setTimeout(() => setDisabled(true), 0);
  };

  return (
    <Fragment>
      {
        assignedTo
          ? <p>{`Assigned to: ${assignedTo.firstName} ${assignedTo.lastName}`}</p>
          : <p><em>Unassigned</em></p>
      }
      {
        !assignedToMe && (
          <div className="assign-to-me">
            <form method="POST" action={`${url}/assign`} onSubmit={onFormSubmit}>
              <input type="hidden" name="assignedTo" value={user.id} />
              <button className="link" disabled={disabled}><span>Assign to me</span></button>
            </form>
          </div>
        )
      }
      <div className="assign-to-other">
        <form method="POST" action={`${url}/assign`} onSubmit={onFormSubmit}>
          <div className="flex">
            <div className="grow">
              <Fieldset schema={assignmentSchema} model={{}} />
            </div>
            <div className="shrink">
              <button className="link" disabled={disabled}><span>Assign</span></button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
