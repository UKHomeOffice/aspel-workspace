import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import fetch from 'r2';
import AccessibleAutocomplete from 'accessible-autocomplete/react';

export default function ProfileSelect(props) {
  const url = useSelector(state => state.static.url);
  const [profiles, setProfiles] = useState([]);
  const [value, setValue] = useState(props.value ? props.value.toString() : '');

  useEffect(() => {
    fetch(`${url}/profiles`).response
      .then(response => response.json())
      .then(response => {
        setProfiles(response);
      });
  }, []);

  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(value);
    }
  }, [value]);

  const defaultValue = (profiles.find(opt => opt.value === props.value) || {}).label;

  const search = (query, callback) => {
    const results = query
      ? profiles.filter(p => p.label.toLowerCase().includes(query.toLowerCase()))
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
        suggestion: item => item ? item.label : ''
      }}
      onConfirm={option => setValue(option ? option.value : '')}
      defaultValue={defaultValue}
      confirmOnBlur={false}
    />
    <input type="hidden" name={props.name} value={value} />
  </Fragment>;
}
