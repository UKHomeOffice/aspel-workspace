import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { clickLinkFilter } from './actions';
import { ApplyChanges } from '../';

export function ShowAll({ selected, label, prop, onChange }) {
  return selected
    ? <ApplyChanges
      onApply={() => onChange(null)}
      label={label}
      filters={{
        [prop]: []
      }}
    />
    : <Fragment>{label}</Fragment>;
}

export const LinkFilter = ({
  filters,
  selected,
  onChange,
  formatter,
  prop,
  label = 'Filter by:',
  showAllLabel = 'All',
  showAllBefore = true
}) => {
  const showAll = <li><ShowAll selected={selected} label={showAllLabel} prop={prop} onChange={onChange} /></li>;

  return (
    <div className="link-filter">
      <label>{ label }</label>
      <ul>
        {
          showAllBefore && showAll
        }
        {
          filters.map(f => {
            const label = formatter ? formatter(f) : f;
            if (f === selected) {
              return <li key={ f }>{ label }</li>;
            }
            return (
              <li key={ f }>
                <ApplyChanges
                  onApply={() => onChange(f)}
                  label={ label }
                  filters={{
                    [prop]: [f]
                  }}
                />
              </li>
            );
          })
        }
        {
          !showAllBefore && showAll
        }
      </ul>
    </div>
  );
};

const mapStateToProps = ({ datatable: { filters: { active, options } } }, { prop, prepend = [], append = [] }) => {
  return {
    selected: active[prop] && active[prop][0],
    filters: [ ...prepend, ...options, ...append ]
  };
};

const mapDispatchToProps = (dispatch, { prop }) => {
  return {
    onChange: val => dispatch(clickLinkFilter(prop, val))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkFilter);
