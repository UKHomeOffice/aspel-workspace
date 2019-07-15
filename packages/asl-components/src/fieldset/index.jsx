import React, { Component } from 'react';
import map from 'lodash/map';
import without from 'lodash/without';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';
import { TextArea, Input, CheckboxGroup, RadioGroup, Select, DateInput } from '@ukhomeoffice/react-components';
import { Snippet, ConditionalReveal } from '../';

const fields = {
  inputText: props => <Input { ...props } />,
  inputEmail: props => <Input type="email" { ...props } />,
  inputPassword: props => <Input type="password" { ...props } />,
  inputDate: props => <DateInput { ...props } onChange={value => props.onChange({ target: { value } })} />,
  textarea: props => <TextArea { ...props } />,
  radioGroup: props => <RadioGroup { ...props } />,
  checkboxGroup: props => <CheckboxGroup { ...props } />,
  select: props => <Select { ...props } />,
  text: props => props.value &&
    <div className={classnames('govuk-form-group', props.name)}>
      <h3>{ props.label }</h3>
      <ReactMarkdown>{ props.value }</ReactMarkdown>
    </div>
};

class Fieldset extends Component {

  constructor(options) {
    super(options);
    this.state = {
      model: this.props.model || {}
    };
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.model, this.props.model)) {
      return this.setState({ model: this.props.model });
    }
  }

  onFieldChange(key, value) {
    const setValue = (field, value) => {
      if (Array.isArray(field)) {
        if (field.includes(value)) {
          return without(field, value);
        }
        return [ ...field, value ];
      }
      return value;
    };

    const model = {
      ...this.state.model,
      [key]: setValue(this.state.model[key], value)
    };

    this.setState({ model }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.model);
      }
    });

  }

  render() {
    const {
      schema,
      errors = {}
    } = this.props;
    const values = (this.state && this.state.model) || this.props.model;
    return (
      <fieldset>
        {
          map(schema, ({ inputType, label, conditionalReveal, showIf, format, ...props }, key) => {
            const value = values[key] || '';
            const field = fields[inputType]({
              key,
              value: format ? format(value) : value,
              label: label || <Snippet>{`fields.${key}.label`}</Snippet>,
              hint: <Snippet optional>{`fields.${key}.hint`}</Snippet>,
              name: key,
              error: errors[key] && <Snippet>{`errors.${key}.${errors[key]}`}</Snippet>,
              onChange: e => this.onFieldChange(key, e.target.value),
              ...props
            });

            if (showIf && !showIf(values)) {
              return null;
            }

            // TODO: replace previous instances of conditionalReveal with reveal property of checkboxGroup
            if (conditionalReveal) {
              return (
                <ConditionalReveal
                  key={key}
                  fieldName={key}
                  value={values[`conditional-reveal-${key}`]}
                  label={<Snippet>{`fields.${key}.conditionalReveal.label`}</Snippet>}
                  yesLabel={<Snippet>{`fields.${key}.conditionalReveal.yesLabel`}</Snippet>}
                  noLabel={<Snippet>{`fields.${key}.conditionalReveal.noLabel`}</Snippet>}
                >{ field }</ConditionalReveal>
              );
            }

            return field;
          })
        }
      </fieldset>
    );
  }
}

export default Fieldset;
