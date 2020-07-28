import React, { useState, useEffect } from 'react';
import map from 'lodash/map';
import without from 'lodash/without';
import castArray from 'lodash/castArray';
import classnames from 'classnames';
import {
  TextArea,
  Input,
  CheckboxGroup,
  RadioGroup,
  Select,
  DateInput
} from '@ukhomeoffice/react-components';
import {
  Snippet,
  ConditionalReveal,
  SpeciesSelector,
  AutoComplete,
  ApplicationConfirm,
  RestrictionsField,
  Markdown,
  DurationField,
  SelectMany,
  Inset
} from '../';

const fields = {
  inputText: props => <Input { ...props } />,
  inputEmail: props => <Input type="email" { ...props } />,
  inputFile: props => <Input type="file" { ...props } />,
  inputPassword: props => <Input type="password" { ...props } />,
  declaration: props => <ApplicationConfirm { ...props } />,
  inputDate: props => <DateInput { ...props } onChange={value => props.onChange({ target: { value } })} />,
  textarea: props => <TextArea { ...props } autoExpand={true} />,
  radioGroup: props => <RadioGroup { ...props } />,
  checkboxGroup: props => <CheckboxGroup { ...props } />,
  select: props => <Select { ...props } />,
  selectMany: props => <SelectMany { ...props } />,
  conditionalReveal: props => <ConditionalReveal { ...props } />,
  speciesSelector: props => <SpeciesSelector {...props} />,
  restrictionsField: props => <RestrictionsField {...props} />,
  inputDuration: props => <DurationField {...props} />,
  autoComplete: props => <AutoComplete {...props} />,
  text: props => (
    <div className={classnames('govuk-form-group', props.name)}>
      <h3>{ props.label }</h3>
      <Markdown>{ props.format ? props.format(props.value) : props.value }</Markdown>
    </div>
  )
};

function normaliseOptions(options, props) {
  if (!options) {
    return;
  }
  return options.map(opt => {
    if (opt.reveal) {
      return {
        ...opt,
        reveal: <Inset><Fieldset schema={opt.reveal} model={props.values} /></Inset>
      };
    }
    return opt;
  });
}

function Field({
  name,
  error,
  inputType,
  value,
  label,
  hint,
  onChange,
  showIf,
  options,
  ...props
}) {
  if (inputType === 'checkboxGroup') {
    value = castArray(value);
  }

  options = normaliseOptions(options, props);

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
    if (v === 'true') {
      v = true;
    }
    if (v === 'false') {
      v = false;
    }
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
    options={options}
    {...props}
  />;
}

export default function Fieldset({ schema, errors = {}, formatters = {}, model, ...props }) {
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
            errors={errors}
            formatters={formatters}
            name={key}
            model={props.values}
            format={(formatters[key] || {}).format}
          />
        ))
      }
    </fieldset>
  );
}
