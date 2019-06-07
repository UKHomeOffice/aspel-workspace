import React from 'react';
import classnames from 'classnames';
import { diffWords } from 'diff';

const Item = ({ added, removed, value }) => (
  <span className={classnames({ added, removed })}>
    {
      removed
        ? <del>{value}</del>
        : value
    }
  </span>
);

const DiffText = ({
  oldValue,
  newValue,
  currentLabel = 'Current',
  proposedLabel = 'Proposed',
  emptyLabel = 'No answer provided'
}) => {
  const diff = diffWords(oldValue || '', newValue || '');
  const previous = diff.filter(item => !item.added);
  const proposed = diff.filter(item => !item.removed);

  return (
    <div className="diff-text govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <h3>{currentLabel}</h3>
        <p>
          {
            previous.length
              ? previous.map((item, i) => <Item {...item} key={i} />)
              : <em>{emptyLabel}</em>
          }
        </p>
      </div>
      <div className="govuk-grid-column-one-half">
        <h3>{proposedLabel}</h3>
        <p>
          {
            proposed.length
              ? proposed.map((item, i) => <Item {...item} key={i} />)
              : <em>{emptyLabel}</em>
          }
        </p>
      </div>
    </div>
  );
};

export default DiffText;
