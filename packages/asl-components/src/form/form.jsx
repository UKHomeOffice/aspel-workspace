import React from 'react';
import { Snippet, Fieldset } from '../';

const Form = ({
  csrfToken,
  className,
  submit = true,
  children,
  ...props
}) => {
  return <form method="POST" noValidate className={className}>
    <Fieldset { ...props } />
    <input type="hidden" name="_csrf" value={csrfToken} />
    { children }
    {
      submit && <button type="submit" className="govuk-button"><Snippet>buttons.submit</Snippet></button>
    }
  </form>;
};

export default Form;
