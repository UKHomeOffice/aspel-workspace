import React, { Fragment, useState } from 'react';
import AccessibleAutocomplete from 'accessible-autocomplete/react';

export default function AutoComplete(props) {
  const [value, setValue] = useState(props.value);
  const defaultValue = (props.options.find(opt => opt.value === props.value) || {});

  function suggest (query, syncResults) {
    syncResults(query
      ? props.options.filter(result => result.label.toLowerCase().includes(query.toLowerCase()))
      : []
    );
  }

  function renderLabel(item) {
    return typeof item === 'object' ? item.label : item;
  }

  return (
    <Fragment>
      <input type="hidden" name={props.name} value={value} />
      <AccessibleAutocomplete
        source={suggest}
        templates={{
          inputValue: renderLabel,
          suggestion: renderLabel
        }}
        onConfirm={option => option && setValue(option.value)}
        defaultValue={defaultValue.label || defaultValue}
      />
    </Fragment>
  );
}
