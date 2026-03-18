import React from 'react';
import ToggleEdit from './toggle-edit';
import Field from './field';

const Fieldset = ({
                    fields,
                    onFieldChange,
                    values,
                    noComments,
                    altLabels,
                    prefix = '',
                    commentPrefix,
                    updateItem,
                    additionalCommentFields = []
                  }) => {
  // Keep your resolve logic for dynamic props
  const resolve = (prop) => {
    if (typeof prop === 'function') {
      return prop(values);
    }
    return prop;
  };

  console.log('Rendering Fieldset with values:', values);

  return (
    <fieldset>
      {fields.map(f => {
        // Skip rendering if show is false
        if (f.show && !resolve(f.show)) {
          return null;
        }

        // Resolve dynamic properties
        const resolved = {
          ...f,
          type: resolve(f.type),
          label: resolve(f.label),
          hint: resolve(f.hint),
          name: resolve(f.name),
          classname: resolve(f.classname),
          options: resolve(f.options)
        };

        const fullName = `${prefix}${resolved.name}`;
        const field = (
          <Field
            {...resolved}
            key={resolved.name}
            name={fullName}
            value={values && values[resolved.name]}
            values={values}
            prefix={prefix}
            commentKey={commentPrefix ? `${commentPrefix}${resolved.name}` : fullName}
            additionalCommentFields={[
              ...additionalCommentFields,
              ...(commentPrefix ? [fullName] : [])
            ]}
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
      })}
    </fieldset>
  );
};

export default Fieldset;
