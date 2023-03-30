import React from 'react';
import some from 'lodash/some';
import { Fieldset } from '..';

export default function DetailsReveal({ label, reveal, values, ...props }) {
  const open = some(reveal, (field, key) => {
    return values[key] || (field.prefix && values[`${field.prefix}-${key}`]);
  });

  return (
    <div className="govuk-form-group">
      <details open={open}>
        <summary>{label}</summary>
        <Fieldset {...props} model={values} schema={reveal} />
      </details>
    </div>
  );
}
