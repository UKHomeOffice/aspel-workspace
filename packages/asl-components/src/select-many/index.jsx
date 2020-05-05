import React, { useState } from 'react';
import map from 'lodash/map';
import uuid from 'uuid/v4';
import { Button, Select } from '@ukhomeoffice/react-components';

export default function SelectMany({ name, label, error, value = [], options, onChange }) {

  const initialFields = value.map(v => {
    return { id: uuid(), value: v };
  });
  if (initialFields.length === 0) {
    initialFields.push({ id: uuid() });
  }

  const [fields, setFields] = useState(initialFields);

  function onFieldChange (id, v) {
    const value = fields.map(f => {
      return f.id === id ? { ...f, value: v } : f;
    });
    setFields(value);
    onChange && onChange(value.map(v => v.value));
  }

  function addAnother(e) {
    e.preventDefault();
    setFields([...fields, { id: uuid() }]);
  }

  function remove(id) {
    if (fields.length === 1) {
      return;
    }
    const value = fields.filter(f => f.id !== id);
    setFields(value);
    onChange && onChange(value.map(v => v.value));
  }

  return (
    <div className="govuk-form-group select-many">
      {
        map(fields, (field, i) => (
          <div key={field.id}>
            <Select
              id={field.id}
              name={name}
              label={label}
              options={options}
              onChange={e => onFieldChange(field.id, e.target.value)}
              value={field.value}
            />
            {
              (fields.length > 1) && <Button onClick={() => remove(field.id)}>Remove</Button>
            }
          </div>
        ))
      }
      <Button onClick={addAnother} className="button-secondary">Add another</Button>
    </div>
  );
}
