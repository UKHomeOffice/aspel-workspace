import React, { useState, Fragment } from 'react';
import { Form, Markdown, Inset, ConditionReminders, Snippet } from '../';

function Conditions({
  conditions,
  label,
  noConditionsLabel,
  canUpdate,
  children,
  editing = false,
  addLabel = 'Add conditions',
  updateLabel = 'Update conditions',
  reminders = []
}) {
  const [isEditing, setEditing] = useState(editing);

  function toggleEdit(e) {
    e.preventDefault();
    setEditing(!isEditing);
  }

  const CancelLink = <a href="#" onClick={toggleEdit}><Snippet>buttons.cancel</Snippet></a>;

  return (
    <div className="conditions">
      <p>{ conditions ? label : noConditionsLabel }</p>
      {
        isEditing && canUpdate
          ? <Form cancelLink={CancelLink} />
          : (
            <Fragment>
              {
                conditions &&
                  <Fragment>
                    <Inset className="condition"><Markdown>{ conditions }</Markdown></Inset>
                    <ConditionReminders reminders={reminders} />
                  </Fragment>
              }
              {
                canUpdate && <a href="#" onClick={toggleEdit}>{conditions ? updateLabel : addLabel }</a>
              }
            </Fragment>
          )
      }
      { children }
    </div>
  );
}

export default Conditions;
