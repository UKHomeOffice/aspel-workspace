import React, { useState } from 'react';
import AccessibleAutocomplete from 'accessible-autocomplete/react';
import { InputWrapper } from '@ukhomeoffice/react-components';

export default function AutoComplete(props) {
  const [value, setValue] = useState(props.value);
  const defaultValue = props.options.find(opt => opt.value === props.value);

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
    <InputWrapper {...props}>
      <input type="hidden" name={props.name} value={value} />
      <AccessibleAutocomplete
        id={props.name}
        source={suggest}
        templates={{
          inputValue: renderLabel,
          suggestion: renderLabel
        }}
        onConfirm={option => setValue(option ? option.value : '')}
        defaultValue={defaultValue && defaultValue.label}
      />
    </InputWrapper>
  );
}
