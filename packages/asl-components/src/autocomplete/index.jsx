import React, { useState, useEffect } from 'react';
import AccessibleAutocomplete from 'accessible-autocomplete/react';
import { InputWrapper } from '@ukhomeoffice/react-components';

export default function AutoComplete(props) {
  const [value, setValue] = useState(props.value);
  const defaultValue = (props.options.find(opt => opt.value === props.value) || {}).label;

  useEffect(() => {
    const inputElement = window.document.querySelector(`input#${props.name}`);

    function onBlur(event) {
      const val = event.target.value;
      if (!val) {
        setValue('');
      }
    }

    inputElement.addEventListener('blur', onBlur);

    return () => {
      inputElement.removeEventListener('blur', onBlur);
    };
  });

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
        confirmOnBlur={false}
        defaultValue={defaultValue}
      />
    </InputWrapper>
  );
}
