import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Snippet, Form } from '@asl/components';
import EnforcementSubjectHeader from './subject-header';

function getCheckboxValues(formElements) {
  return formElements && Array.from(formElements).filter(f => f.checked).map(f => f.value);
}

function EnforcementFlagForm({ subject, toggleEdit, formFields }) {
  return (
    <div>
      { formFields }
      <p className="control-panel">
        <button type="submit" className="govuk-button">Save</button>
        <a href="#" onClick={toggleEdit(subject)}><Snippet>buttons.cancel</Snippet></a>
      </p>
    </div>
  );
}

function EnforcementSubjectEdit({ subject, idx, toggleEdit }) {
  const { url } = useSelector(state => state.static);
  const [schema, setSchema] = useState({});
  const [model, setModel] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    function getEditForm() {
      return fetch(`${url}/subject/${subject.id}/form`)
        .then(response => response.json())
        .then(({ model, schema }) => {
          // model must be set before schema, otherwise the values do not get reflected in the rendered component
          setModel(model);
          setSchema(schema);
        });
    }
    getEditForm();
  }, [subject]);

  function onSubmit(e) {
    e.preventDefault();

    const flagStatus = e.target.flagStatus.value;
    const flags = getCheckboxValues(e.target.flags) || [];
    const remedialAction = getCheckboxValues(e.target.remedialAction) || [];

    const opts = {
      method: 'put',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flagStatus, flags, remedialAction })
    };
    return fetch(`${url}/subject/${subject.id}`, opts)
      .then(response => response.json())
      .then(data => {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          toggleEdit(data)(e);
        }
      });
  }

  return (
    <div className="enforcement-subject" id={subject.id}>
      <h3><Snippet idx={idx + 1}>subjects.repeaterHeading</Snippet></h3>
      <EnforcementSubjectHeader subject={subject} />

      <div className="enforcement-flags">
        <h3><Snippet>flag.heading</Snippet></h3>
        <Form schema={schema} model={model} errors={errors} detachFields={true} submit={false} onSubmit={onSubmit}>
          <EnforcementFlagForm subject={subject} toggleEdit={toggleEdit} />
        </Form>
      </div>
    </div>
  );
}

export default EnforcementSubjectEdit;
