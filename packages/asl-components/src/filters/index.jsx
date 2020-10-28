import React, { useState, useEffect } from 'react';
import { OptionSelect, CheckedOption } from '@ukhomeoffice/react-components';
import classnames from 'classnames';
import map from 'lodash/map';
import some from 'lodash/some';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ApplyChanges, Snippet, ControlBar } from '../';
import { changeFilters } from './actions';

const selector = ({ datatable: { filters: { options, active } } }) => {
  return {
    active,
    options
  };
};

export default function Filters({ formatters }) {
  const { active, options } = useSelector(selector, shallowEqual);
  const dispatch = useDispatch();

  const opts = options.reduce((obj, { key, values }) => {
    return {
      ...obj,
      [key]: {
        values,
        format: formatters[key] && formatters[key].format
      }
    };
  }, {});

  const [activeFilters, setActiveFilters] = useState(active);
  const [visible, setVisible] = useState(some(activeFilters, 'length'));

  useEffect(() => {
    scrollToCheckedElements();
  }, []);

  function onFiltersChange(filters) {
    dispatch(changeFilters(filters));
  }

  function scrollToCheckedElements() {
    Object.keys(activeFilters).forEach(key => {
      const container = document.getElementById(`${key}-options`);
      const child = document.getElementById(`${key}-${activeFilters[key][0]}`);
      if (container && child) {
        const offset = child.parentNode.offsetTop;
        container.scrollTo(0, offset);
      }
    });
  }

  function emitChange() {
    onFiltersChange(activeFilters);
  }

  function clearFilters() {
    onFiltersChange({});
    setActiveFilters({});
  }

  function onCheckboxChange(key, filter, checked) {
    const activeClone = { ...activeFilters };
    if (checked) {
      activeClone[key] = activeClone[key] || [];
      if (!activeClone[key].includes(filter)) {
        activeClone[key].push(filter);
      }
    } else {
      const index = activeClone[key].indexOf(filter);
      activeClone[key].splice(index, 1);
    }
    if (!activeClone[key].length) {
      delete activeClone[key];
    }
    setActiveFilters(activeClone);
  }

  function isChecked(key, filter) {
    return activeFilters[key] && activeFilters[key].includes(filter);
  }

  function toggleVisible(e) {
    e.preventDefault();
    setVisible(!visible);
  }

  return (
    <section className="filters-component">
      <h3 className={classnames({
        'toggle-filter-link': true,
        'filters-hidden': !visible
      })}
      >
        <a href="#" onClick={toggleVisible}><Snippet>filters.filterBy</Snippet></a>
      </h3>
      <section className={classnames({ hidden: !visible })}>
        <ApplyChanges
          type="form"
          onApply={emitChange}
        >
          <div className="filters">
            {
              map(opts, ({ values, format }, key) =>
                <div key={key} className="filter">
                  <OptionSelect
                    title={<Snippet>{`fields.${key}.label`}</Snippet>}
                    defaultOpen={Object.keys(activeFilters).includes(key)}
                    id={key}>
                    {
                      values.map((filter, index) => {
                        let label;
                        let value;

                        if (typeof filter === 'string') {
                          value = filter;
                          label = format ? format(filter) : filter;
                        } else {
                          value = filter.value;
                          label = filter.label;
                        }
                        return (
                          <CheckedOption
                            key={index}
                            name={`filter-${key}`}
                            id={`${key}-${value}`}
                            value={value}
                            onChange={e => onCheckboxChange(key, value, e.target.checked)}
                            checked={!!isChecked(key, value)}
                          >
                            { label }
                          </CheckedOption>
                        );
                      })
                    }
                  </OptionSelect>
                </div>
              )
            }
          </div>
          <ControlBar>
            <button type="submit" className="govuk-button"><Snippet>filters.applyLabel</Snippet></button>
            <ApplyChanges
              query={{
                filters: {}
              }}
              onApply={clearFilters}
              label={<Snippet>filters.clearLabel</Snippet>} />
          </ControlBar>
        </ApplyChanges>
      </section>

    </section>
  );
}
