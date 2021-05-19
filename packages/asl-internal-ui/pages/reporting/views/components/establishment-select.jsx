import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import AccessibleAutocomplete from 'accessible-autocomplete/react';

export default function AutoComplete(props) {
  const [value, setValue] = useState(props.value && props.value.toString());

  const establishments = useSelector(state => state.static.establishments);
  const defaultValue = (establishments.find(opt => opt.value === props.value) || {}).label;

  const search = (query, callback) => {
    const results = query
      ? establishments.filter(est => est.label.toLowerCase().includes(query.toLowerCase()))
      : [];
    callback(results);
  };

  return <Fragment>
    <AccessibleAutocomplete
      className={props.className}
      id={props.name}
      source={search}
      templates={{
        inputValue: item => item ? item.label : '',
        suggestion: item => {
          if (item && item.status !== 'active') {
            return `${item.label} (${item.status === 'inactive' ? 'draft' : item.status})`;
          }
          return item ? item.label : '';
        }
      }}
      onConfirm={option => setValue(option ? option.value : '')}
      defaultValue={defaultValue}
      confirmOnBlur={false}
    />
    <input type="hidden" name={props.name} value={value} />
  </Fragment>;
}
