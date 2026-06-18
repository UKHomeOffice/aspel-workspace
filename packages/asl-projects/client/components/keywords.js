import React, { useState } from 'react';
import classnames from 'classnames';
import range from 'lodash/range';
import Fieldset from './fieldset';

// internal state is:
// keywords = {
//   'keyword-0': 'val1',
//   'keyword-1': 'val2',
//   'keyword-2': '',
//   'keyword-3': 'val4',
//   'keyword-4': ''
// }
// which is flattened to ['val1', val2', 'val4'] on save

export default function Keywords(props) {
  const numKeywords = 5;

  function mapKeywords(keywords = []) {
    return range(0, numKeywords).reduce((obj, i) => {
      obj[`keyword-${i}`] = keywords[i];
      return obj;
    }, {});
  }

  function getFields() {
    return range(0, numKeywords).map(i => {
      return {
        name: `keyword-${i}`,
        label: `Keyword ${i + 1}`,
        type: 'text'
      };
    });
  }

  const [keywords, setKeywords] = useState(mapKeywords(props.value));
  const describedBy = [props.hint && `${props.name}-hint`, props.error && `${props.name}-error`].filter(Boolean).join(' ') || undefined;

  function onKeywordChange(key, value) {
    const updatedKeywords = {
      ...keywords,
      [key]: value.trim()
    };

    setKeywords(updatedKeywords);
    props.onChange(Object.values(updatedKeywords).filter(Boolean));
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className={classnames('govuk-form-group', 'keywords', { 'govuk-form-group--error': props.error })}>
          <Fieldset
            className="govuk-fieldset"
            describedBy={describedBy}
            hint={props.hint && <div id={`${props.name}-hint`} className="govuk-hint">{props.hint}</div>}
            error={props.error && <div id={`${props.name}-error`} className="govuk-error-message">{props.error}</div>}
            fields={getFields()}
            legend={(
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                <span className="govuk-fieldset__heading">{props.label}</span>
              </legend>
            )}
            onFieldChange={onKeywordChange}
            values={keywords}
            noComments={true}
          />
        </div>
      </div>
    </div>
  );
}
