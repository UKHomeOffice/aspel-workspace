import React from 'react';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import reduce from 'lodash/reduce';
import { Snippet } from '../';

function formatValue(key, { format } = {}) {
  const value = format ? format(key) : key;
  return value || '-';
}

function getValue(value, options, values) {
  if (!options.getValue) {
    return value;
  }

  return options.getValue(values);
}

function getDiff(schema, before, after) {
  return reduce(schema, (all, options, key) => {
    if (options.showDiff === false) {
      return all;
    }
    const oldValue = getValue(before[key], options, before);
    const newValue = getValue(after[key], options, after);
    return { ...all,
      [key]: {
        oldValue,
        newValue
      }
    };
  }, {});
}

function hasChanged(before, after) {
  // don't flag changes between `null` and `''`
  if (!before && !after) {
    return false;
  }
  return !(isEqual(before, after));
}

export default function Diff({
  before,
  after,
  schema,
  diff,
  formatters = {},
  comparator = hasChanged,
  currentLabel = 'Current',
  proposedLabel = 'Proposed'
}) {
  diff = diff || getDiff(schema, before, after);
  return (
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
              <td>{formatValue(oldValue, formatters[key])}</td>
              <td>
                <span className={className}>{formatValue(newValue, formatters[key])}</span>
              </td>
            </tr>;
          })
        }
      </tbody>
    </table>
  );
}
