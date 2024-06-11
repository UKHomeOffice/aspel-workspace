import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import fetch from 'r2';
import AccessibleAutocomplete from 'accessible-autocomplete/react';

export default function EstablishmentSelect(props) {
  const url = useSelector(state => state.static.url);
  const [establishments, setEstablishments] = useState([]);
  const [value, setValue] = useState(props.value ? props.value.toString() : '');

  useEffect(() => {
    fetch(`${url}/establishments`).response
      .then(response => response.json())
      .then(response => {
        setEstablishments(response);
      });
  }, []);

  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(value);
    }
  }, [value]);

  const defaultValue = (establishments.find(opt => opt.value === props.value) || {}).label;

  const search = (query, callback) => {
    const results = query
      ? establishments.filter(est => est.label.toLowerCase().includes(query.toLowerCase()))
      : [];
    callback(results);
  };

  return (
    <Fragment>
      <AccessibleAutocomplete
        className={props.className}
        id={props.name}
        source={search}
        templates={{
          inputValue: item => item ? item.label : '',
          suggestion: item => item ? item.label : ''
        }}
        onConfirm={option => setValue(option ? option.value : '')}
        defaultValue={defaultValue}
        confirmOnBlur={false}
      />
      <input type="hidden" name={props.name} value={value} />
    </Fragment>
  );
}
