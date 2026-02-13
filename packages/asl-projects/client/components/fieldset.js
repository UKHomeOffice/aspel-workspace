import React from 'react';
import ToggleEdit from './toggle-edit';
import Field from './field';

const Fieldset = ({ fields, onFieldChange, values, noComments, altLabels, prefix = '', updateItem }) => {
  // This function resolves field properties that might be functions
  // It DOES NOT convert everything to strings - it preserves React elements, numbers, etc.
  const resolve = (prop) => {
    // If the property is a function, call it with the current values
    if (typeof prop === 'function') {
      return prop(values);
    }
    // Otherwise, return the value exactly as-is
    // This could be:
    // - a string (like "Hello {{ speciesLabel }}")
    // - a React element (like from raPlayback)
    // - a number (like 5)
    // - null or undefined
    // - boolean (true/false)
    return prop;
  };

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
