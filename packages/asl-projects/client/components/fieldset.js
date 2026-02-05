import React from 'react';
import ToggleEdit from './toggle-edit';
import Field from './field';

const Fieldset = ({ fields, onFieldChange, values, noComments, altLabels, prefix = '', updateItem }) => {
  const resolve = (prop) => (typeof prop === 'function' ? prop(values) : prop);

  return (
    <fieldset>
      {
        fields.map(f => {
          // Don't render if show is false
          if (f.show && !resolve(f.show)) {
            return null;
          }

          const resolved = {
            ...f,
            type: resolve(f.type),
            label: resolve(f.label),
            hint: resolve(f.hint),
            name: resolve(f.name),
            classname: resolve(f.classname)
          };

          const field = (
            <Field
              {...resolved}
              key={resolved.name}
              className={resolved.classname}
              name={`${prefix}${resolved.name}`}
              value={values && values[resolved.name]}
              values={values}
              prefix={prefix}
              onChange={value => onFieldChange(resolved.name, value)}
              updateItem={updateItem}
              onFieldChange={onFieldChange}
              noComments={noComments}
              altLabels={altLabels}
            />
          );

          if (resolved.toggleEdit) {
            return (
              <ToggleEdit
                label={resolved.label}
                value={values && values[resolved.name]}
                values={values}
                confirmEdit={resolved.confirmEdit}
                key={resolved.name}
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
