import React, { Fragment } from 'react';
import { Snippet, Fieldset } from '../';

const Form = ({
  csrfToken,
  className,
  submit = true,
  children,
  detachFields,
  schema,
  ...props
}) => {
  const formFields = (
    <Fragment>
      <Fieldset schema={schema} { ...props } />
      {
        submit && <button type="submit" className="govuk-button"><Snippet>buttons.submit</Snippet></button>
      }
    </Fragment>
  );

  return (
    <form
      method="POST"
      noValidate
      className={className}
      encType={Object.values(schema).map(s => s.inputType).includes('inputFile') ? 'multipart/form-data' : null}
    >
      <input type="hidden" name="_csrf" value={csrfToken} />
      {
        detachFields
          ? React.Children.map(children, child =>
            React.cloneElement(child, { formFields })
          )
          : children
      }
      {
        !detachFields && formFields
      }
    </form>
  );
};

export default Form;
