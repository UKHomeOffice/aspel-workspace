import React, { useState } from 'react';
import { RadioGroup } from '@ukhomeoffice/react-components';
import { Inset, Fieldset } from '../';

export default function ConditionalReveal({ label, reveal, name, values, ...props }) {
  const initialState = values[name] === 'true' || Object.keys(reveal).some(key => values[key]);
  const [showing, setShowing] = useState(initialState);

  function onChange(e) {
    return setShowing(e.target.value === 'true');
  }

  return <RadioGroup
    name={name}
    inline={true}
    label={label}
    options={[
      {
        label: 'Yes',
        value: true,
        reveal: (
          <Inset>
            <Fieldset {...props} model={values} schema={reveal} onChange={null} />
          </Inset>
        )
      },
      {
        label: 'No',
        value: false
      }
    ]}
    value={showing}
    onChange={onChange}
  />;
}
