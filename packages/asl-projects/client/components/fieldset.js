import React from 'react';

import ToggleEdit from './toggle-edit';
import Field from './field';

const Fieldset = ({ fields, onFieldChange, values, noComments, altLabels, prefix = '' }) => (
  <fieldset>
    {
      fields.map(f => {
        const field = <Field
          { ...f }
          key={ f.name }
          name={ `${prefix}${f.name}` }
          value={ values && values[f.name] }
          values={ values }
          prefix={ prefix }
          onChange={ value => onFieldChange(f.name, value) }
          onFieldChange={onFieldChange}
          noComments={noComments}
          altLabels={altLabels}
        />;

        if (f.toggleEdit) {
          return (
            <ToggleEdit
              label={f.label}
              value={values && values[f.name]}
              values={values}
              confirmEdit={f.confirmEdit}
            >
              {field}
            </ToggleEdit>
          );
        }

        return field;
      })
    }
  </fieldset>
)

export default Fieldset;
