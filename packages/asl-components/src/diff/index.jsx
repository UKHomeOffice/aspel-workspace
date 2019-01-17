import React from 'react';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import { Snippet } from '../';

const getValue = (key, { format } = {}) => {
  const value = format ? format(key) : key;
  return value || '-';
};

export const Diff = ({
  diff,
  formatters = {},
  comparator = (a, b) => !(isEqual(a, b)),
  currentLabel = 'Current',
  proposedLabel = 'Proposed'
}) => (
  <table className="govuk-table">
    <thead>
      <tr>
        <th></th>
        <th>{currentLabel}</th>
        <th>{proposedLabel}</th>
      </tr>
    </thead>
    <tbody>
      {
        map(diff, ({ oldValue, newValue }, key) => {
          const className = comparator(oldValue, newValue, formatters[key]) ? 'highlight' : '';
          return <tr key={key}>
            <td><Snippet>{`fields.${key}.label`}</Snippet></td>
            <td>{getValue(oldValue, formatters[key])}</td>
            <td>
              <span className={className}>{getValue(newValue, formatters[key])}</span>
            </td>
          </tr>;
        })
      }
    </tbody>
  </table>
);

const mapStateToProps = ({ model, static: { values, schema } }) => {
  return {
    diff: reduce(schema, (all, value, key) => {
      if (value.showDiff === false) {
        return all;
      }
      return { ...all,
        [key]: {
          oldValue: model[key],
          newValue: values[key]
        }};
    }, {})
  };
};

export default connect(mapStateToProps)(Diff);
