import React, { useState, Fragment } from 'react';
import { Inset, Snippet, Form } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';
import format from 'date-fns/format';
import Markdown from 'react-markdown';
import { dateFormat } from '@asl/pages/constants';

const schema = {
  comment: {
    inputType: 'textarea'
  }
};

function UpdatingForm({ id, isExempt, onCancelClick, formFields }) {
  return (
    <Fragment>
      {
        formFields
      }
      <input type="hidden" name="taskId" value={id} />
      <input type="hidden" name="isExempt" value={!isExempt} />
      <p className="control-panel">
        <Button><Snippet>{`change.${isExempt ? 'notExempt' : 'exempt'}`}</Snippet></Button>
        <a href="#" onClick={onCancelClick}>Cancel</a>
      </p>
    </Fragment>
  );
}

function Reason({ actionedBy, updatedAt, comment, label }) {
  const timestamp = format(updatedAt, dateFormat.long);
  return (
    <div className="govuk-grid-row reason">
      <div className="govuk-grid-column-three-quarters">
        <p><strong>{label} </strong>{actionedBy.firstName} {actionedBy.lastName}</p>
        <Markdown>{comment}</Markdown>
      </div>
      <div className="govuk-grid-column-one-quarters">{timestamp}</div>
    </div>
  );
}

function UpdatingPanel({ id, isExempt, onCancelClick }) {

  function getMissedLabel(isExempt) {
    return isExempt ? 'Not missed' : 'Missed';
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <table className="govuk-table">
          <thead>
            <tr>
              <th>Current status</th>
              <th>New status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{ getMissedLabel(isExempt) }</td>
              <td><span className="highlight">{ getMissedLabel(!isExempt) }</span></td>
            </tr>
          </tbody>
        </table>
        <Form submit={false} schema={schema} detachFields>
          <UpdatingForm id={id} isExempt={isExempt} onCancelClick={onCancelClick} />
        </Form>
      </div>
    </div>
  );
}

function SummaryPanel({ reason, exemption, isExempt, id }) {
  const [updating, setUpdating] = useState(false);

  function toggleUpdating(e) {
    e.preventDefault();
    setUpdating(!updating);
  }

  return (
    <div className="deadline-exemption-summary">
      {
        reason && <Reason {...reason} label={<Snippet>deadline.activity.reason</Snippet>} />
      }
      {
        exemption && exemption.reasons && exemption.reasons.map((reason, idx) =>
          <Reason key={idx} {...reason} label={<Snippet>{`deadline.activity.exemption.${reason.isExempt ? 'exempt' : 'notExempt'}`}</Snippet>} />
        )
      }
      {
        updating
          ? <UpdatingPanel id={id} isExempt={isExempt} onCancelClick={toggleUpdating} />
          : <p><a href="#" onClick={toggleUpdating}><Snippet>{`change.${isExempt ? 'notExempt' : 'exempt'}`}</Snippet></a></p>
      }
    </div>
  );
}

export default function Row({ model }) {
  const { id, isExempt, reason, exemption } = model;

  function preventCollapse(e) {
    e.stopPropagation();
  }

  return (
    <Inset onClick={preventCollapse}>
      <SummaryPanel id={id} isExempt={isExempt} reason={reason} exemption={exemption} />
    </Inset>
  );
}
