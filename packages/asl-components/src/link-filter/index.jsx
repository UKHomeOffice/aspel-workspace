import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { clickLinkFilter } from './actions';
import { ApplyChanges } from '../';

const LinkFilter = ({
  filters,
  selected,
  onChange,
  formatter,
  prop,
  label = 'Filter by:'
}) => {
  return (
    <div className="link-filter">
      <label>{ label }</label>
      <ul>
        <li>
          {
            selected
              ? <ApplyChanges
                onApply={() => onChange(null)}
                label="All"
                filters={{
                  [prop]: []
                }}
              />
              : <Fragment>All</Fragment>
          }
        </li>
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
      </ul>
    </div>
  );
};

const mapStateToProps = ({ datatable: { filters: { active, options } } }, { prop, append }) => {
  return {
    selected: active[prop] && active[prop][0],
    filters: [ ...options, ...append ]
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
