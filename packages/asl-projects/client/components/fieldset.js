import React from 'react';
import ToggleEdit from './toggle-edit';
import Field from './field';

const Fieldset = ({ fields, onFieldChange, values, noComments, altLabels, prefix = '', commentPrefix, updateItem, additionalCommentFields = [] }) => {
  return (
    <fieldset>
      {
        fields.map(f => {
          const fullName = `${prefix}${f.name}`;
          const field = <Field
            { ...f }
            key={ f.name }
            name={ fullName }
            value={ values && values[f.name] }
            values={ values }
            prefix={ prefix }
            commentKey={ commentPrefix ? `${commentPrefix}${f.name}` : fullName }
            additionalCommentFields={[
              ...additionalCommentFields,
              ...(commentPrefix ? [fullName] : [])
            ]}
            onChange={ value => onFieldChange(f.name, value) }
            updateItem={updateItem}
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
                key={f.name}
              >
                {field}
              </ToggleEdit>
            );
          }

          return field;
        })
      }
    </fieldset>
  );
};

export default Fieldset;
