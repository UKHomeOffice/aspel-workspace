import React, { Fragment } from 'react';
import { Snippet, Fieldset } from '../';

const Form = ({
  csrfToken,
  className,
  submit = true,
  children,
  detachFields,
  ...props
}) => {
  const formFields = (
    <Fragment>
      <Fieldset { ...props } />
      {
        submit && <button type="submit" className="govuk-button"><Snippet>buttons.submit</Snippet></button>
      }
    </Fragment>
  );

  return (
    <form method="POST" noValidate className={className}>
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
