import React, { useState } from 'react';
import classnames from 'classnames';
import range from 'lodash/range';
import Fieldset from '../fieldset';

const generateOptions = range => range.map(value => ({ value, label: value.toString() }));

export default function DurationField(props) {
  const initialState = props.value || { years: '', months: '' };
  const [duration, setDuration] = useState(initialState);

  function onChange({ years, months }) {
    years = parseInt(years, 10) || duration.years;
    months = duration.years === 5 ? 0 : (parseInt(months, 10) || duration.months);
    return setDuration({ years, months });
  }

  function getSchema() {
    const maxYears = 5;
    const maxMonths = duration.years < 5 ? 11 : 0;

    return {
      years: {
        inputType: 'select',
        options: generateOptions(range(0, maxYears + 1)),
        validate: 'required',
        onChange
      },
      months: {
        inputType: 'select',
        options: generateOptions(range(0, maxMonths + 1)),
        validate: 'required',
        onChange
      }
    };
  }

  return (
    <div className={classnames('govuk-form-group', 'duration', { 'govuk-form-group--error': props.error })}>
      <label className="govuk-label" htmlFor={props.name}>{props.label}</label>
      { props.hint && <span id={`${props.name}-hint`} className="govuk-hint">{props.hint}</span> }
      { props.error && <span id={`${props.name}-error`} className="govuk-error-message">{props.error}</span> }
      <Fieldset schema={getSchema()} model={duration} />
    </div>
  );
}
