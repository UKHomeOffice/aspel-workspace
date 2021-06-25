import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Snippet } from '@asl/components';
import { CheckboxGroup, Input } from '@ukhomeoffice/react-components';
import { changeFilters } from '@asl/components/src/filters/actions';
import isEqual from 'lodash/isEqual';

function uppercaseFirst(str) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1).toLowerCase()}`;
}

function Filter({ name, format, useSearch, initialFilters }) {
  const { options, active } = useSelector(state => state.datatable.filters, shallowEqual);
  initialFilters = initialFilters
    ? initialFilters.map(value => ({ label: <Snippet>{`filters.${name}.options.${value}`}</Snippet>, value }))
    : options.find(f => f.key === name).values;

  const dispatch = useDispatch();
  const [filters, setValues] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState(active[name] || []);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (useSearch) {
      setValues(initialFilters.filter(v => (activeFilters || []).includes(v) || v.toLowerCase().includes(search.toLowerCase())));
    }
  }, [search]);

  useEffect(() => {
    if (!isEqual(activeFilters, active[name] || [])) {
      dispatch(changeFilters({ ...active, [name]: activeFilters }));
    }
  }, [activeFilters]);

  function onFiltersChange(e) {
    const itemRemoved = activeFilters.includes(e.target.value);

    const newValue = itemRemoved
      ? activeFilters.filter(v => v !== e.target.value)
      : [ ...activeFilters, e.target.value ];

    setActiveFilters(newValue);
  }

  function applyFormat(str) {
    return {
      value: str,
      label: format(str)
    };
  }

  return (
    <details open={Object.keys(active).includes(name)}>
      <summary><Snippet>{`filters.${name}.title`}</Snippet></summary>
      { useSearch && <Input value={search} name="search" onChange={e => setSearch(e.target.value)} />}
      <CheckboxGroup
        name={name}
        options={format ? filters.map(applyFormat) : filters}
        className="smaller"
        onChange={onFiltersChange}
        value={activeFilters}
      />
    </details>
  );
}

export default function Filters() {
  return (
    <div className="projects-content-filters">
      <h3><Snippet>filters.title</Snippet></h3>
      <ul>
        <li>
          <Filter name="species" useSearch={true} />
        </li>
        <li>
          <Filter name="fields" initialFilters={['granted', 'all', 'nts']} />
        </li>
        <li>
          <Filter name="status" format={uppercaseFirst} />
        </li>
        <li>
          <Filter name="purposes" initialFilters={['a', 'b', 'b1', 'b2', 'b3', 'c', 'd', 'e', 'f', 'g']} />
        </li>
        <li>
          <Filter name="extra" initialFilters={['ra', 'continuation']} />
        </li>
      </ul>
    </div>
  );
}
