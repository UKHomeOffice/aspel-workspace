import React, { useState } from 'react';
import map from 'lodash/map';
import uuid from 'uuid/v4';
import { Button, Select } from '@ukhomeoffice/react-components';

export default function SelectMany({ name, label, error, value, options }) {
  const newField = () => {
    return { [`${name}-${uuid()}`]: '' };
  };

  const [fields, setFields] = useState({ ...newField() });

  console.log({fields});

  function onFieldChange (e) {
    console.log({
      existingFields: fields,
      targetName: e.target.name,
      targetValue: e.target.value
    });

    fields[e.target.name] = e.target.value;
    setFields(fields);
  }

  function addAnother(e) {
    e.preventDefault();

    console.log(Object.keys(fields).length);

    setFields({
      ...fields,
      ...newField()
    });

    console.log(Object.keys(fields).length);
  }

  function remove(id) {
    delete fields[id];
    setFields(fields);
  }

  map(fields, (value, id) => {
    console.log({value, id});
  });

  return (
    <div className="govuk-form-group select-many">
      {
        map(fields, (value, id) => (
          <div key={id}>
            <Select
              id={id}
              name={id}
              label={label}
              options={options}
              onChange={onFieldChange}
              value={value}
            />
          </div>
        ))
      }
      <Button onClick={addAnother} className="button-secondary">Add another</Button>
    </div>
  );
}
