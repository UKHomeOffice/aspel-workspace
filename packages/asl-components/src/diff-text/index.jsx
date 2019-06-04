import React, { Fragment } from 'react';
import classnames from 'classnames';
import * as jsdiff from 'diff';

const Item = ({ added, removed, value }) => (
  <span className={classnames({ added, removed })}>
    {
      removed
        ? <del>{value}</del>
        : value
    }
  </span>
)

const DiffText = ({
  oldValue,
  newValue,
  currentLabel = 'Current',
  proposedLabel = 'Proposed'
}) => {
  const diff = jsdiff.diffWords(oldValue, newValue);

  return (
    <div className="diff-text govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <h3>{currentLabel}</h3>
        <p>
          {
            diff.filter(item => !item.added).map(item => <Item {...item} />)
          }
        </p>
      </div>
      <div className="govuk-grid-column-one-half">
        <h3>{proposedLabel}</h3>
        <p>
          {
            diff.filter(item => !item.removed).map(item => <Item {...item} />)
          }
        </p>
      </div>
    </div>
  )
};

export default DiffText;
