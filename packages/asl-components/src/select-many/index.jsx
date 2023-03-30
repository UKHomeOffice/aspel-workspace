import React, { useState } from 'react';
import classnames from 'classnames';
import map from 'lodash/map';
import { v4 as uuid } from 'uuid';
import { Button, Select } from '@ukhomeoffice/react-components';

export default function SelectMany({ name, label, addAnotherLabel, removeLabel, minRequiredFields = 1, value = [], options, onChange }) {
  const initialFields = (value || []).map(v => {
    return { id: uuid(), value: v };
  });

  if (initialFields.length === 0) {
    initialFields.push({ id: uuid() });
  }

  const [fields, setFields] = useState(initialFields);

  addAnotherLabel = addAnotherLabel || 'Add another';
  removeLabel = removeLabel || 'Remove';

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

  function remove(e, id) {
    e.preventDefault();
    if (fields.length === minRequiredFields) {
      return;
    }
    const value = fields.filter(f => f.id !== id);
    setFields(value);
    onChange && onChange(value.map(v => v.value));
  }

  return (
    <div className={classnames('govuk-form-group', 'select-many', name)}>
      {
        map(fields, field => (
          <div key={field.id} className="select-row">
            <Select
              id={field.id}
              name={name}
              label={label}
              options={options}
              onChange={e => onFieldChange(field.id, e.target.value)}
              value={field.value}
            />
            {
              (fields.length > minRequiredFields) && <a href="#" onClick={e => remove(e, field.id)}>{removeLabel}</a>
            }
          </div>
        ))
      }
      <Button onClick={addAnother} className="button-secondary">{addAnotherLabel}</Button>
    </div>
  );
}
