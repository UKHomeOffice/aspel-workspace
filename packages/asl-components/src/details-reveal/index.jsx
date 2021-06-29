import React from 'react';
import { Fieldset } from '..';

export default function DetailsReveal({ label, reveal, values, ...props }) {
  // console.log('values', values);
  // console.log('reveal', reveal);
  return (
    <details>
      <summary>{label}</summary>
      <Fieldset {...props} model={values} schema={reveal} />
    </details>
  );
}
