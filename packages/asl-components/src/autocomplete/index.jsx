import React, { useState, useEffect } from 'react';
import AccessibleAutocomplete from 'accessible-autocomplete/react';
import { InputWrapper } from '@ukhomeoffice/react-components';
import { getUrl } from '../link';

export default function AutoComplete(props) {
  const [value, setValue] = useState(props.value);
  const defaultValue = props.defaultValue || (props.options.find(opt => opt.value === props.value) || {}).label;
  const apiPath = props.apiPath ? getUrl({ page: props.apiPath }) : null;

  useEffect(() => {
    if (!props.name) {
      return;
    }
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

  useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(value);
  }, [value]);

  function simpleSearch (query, syncResults) {
    syncResults(query
      ? props.options.filter(result => result.label.toLowerCase().includes(query.toLowerCase()))
      : []
    );
  }

  function apiSearch (query, syncResults) {
    if (!query) {
      return syncResults([]);
    }
    window.fetch(`${apiPath}?search=${query}`)
      .then(res => res.json())
      .then(results => {
        syncResults(results || []);
      })
      .catch(err => console.error('Failed to fetch', err));
  }

  function renderLabel(item) {
    return typeof item === 'object' ? item.label : item;
  }

  return (
    <InputWrapper {...props}>
      {
        props.name && <input type="hidden" name={props.name} value={value} />
      }
      <AccessibleAutocomplete
        id={props.name}
        source={props.apiPath ? apiSearch : simpleSearch}
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
