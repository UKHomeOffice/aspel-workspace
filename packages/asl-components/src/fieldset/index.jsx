import React, { useState, useEffect } from 'react';
import map from 'lodash/map';
import without from 'lodash/without';
import castArray from 'lodash/castArray';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';
import { TextArea, Input, CheckboxGroup, RadioGroup, Select, DateInput } from '@ukhomeoffice/react-components';
import { Snippet, ConditionalReveal, SpeciesSelector } from '../';

const fields = {
  inputText: props => <Input { ...props } />,
  inputEmail: props => <Input type="email" { ...props } />,
  inputFile: props => <Input type="file" { ...props } />,
  inputPassword: props => <Input type="password" { ...props } />,
  inputDate: props => <DateInput { ...props } onChange={value => props.onChange({ target: { value } })} />,
  textarea: props => <TextArea { ...props } autoExpand={true} />,
  radioGroup: props => <RadioGroup { ...props } />,
  checkboxGroup: props => <CheckboxGroup { ...props } />,
  select: props => <Select { ...props } />,
  conditionalReveal: props => <ConditionalReveal { ...props } />,
  speciesSelector: props => <SpeciesSelector {...props} />,
  text: props => props.value &&
    <div className={classnames('govuk-form-group', props.name)}>
      <h3>{ props.label }</h3>
      <ReactMarkdown>{ props.value }</ReactMarkdown>
    </div>
};

function Field({
  name,
  error,
  inputType,
  value,
  format,
  label,
  hint,
  onChange,
  showIf,
  ...props
}) {
  if (inputType === 'checkboxGroup') {
    value = castArray(value);
  }

  const [fieldValue, setFieldValue] = useState(value);

  useEffect(() => {
    if (onChange) {
      onChange({
        ...props.values,
        [name]: fieldValue
      });
    }
  }, [fieldValue]);

  function onFieldChange(e) {
    let v = e.target.value;
    if (Array.isArray(fieldValue)) {
      if (fieldValue.includes(v)) {
        v = without(fieldValue, v);
      } else {
        v = [...fieldValue, v];
      }
    }
    setFieldValue(v);
  }

  const Component = fields[inputType];

  if (showIf && !showIf(props.values)) {
    return null;
  }

  return <Component
    label={label || <Snippet>{`fields.${name}.label`}</Snippet>}
    hint={<Snippet optional>{`fields.${name}.hint`}</Snippet>}
    error={error && <Snippet>{`errors.${name}.${error}`}</Snippet>}
    value={fieldValue}
    onChange={onFieldChange}
    name={name}
    {...props}
  />;
}

export default function Fieldset({ schema, errors = {}, model, ...props }) {
  return (
    <fieldset>
      {
        map(schema, (field, key) => (
          <Field
            {...props}
            {...field}
            key={key}
            values={model}
            value={model[key]}
            error={errors[key]}
            name={key}
          />
        ))
      }
    </fieldset>
  );
}
