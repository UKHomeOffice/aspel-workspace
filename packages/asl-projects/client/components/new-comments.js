import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

/**
 * On a version that is no longer live, comments are history - nothing is "new"
 * (ASL-5113 AC01). They still need a count, or they are undiscoverable: the
 * summary would give no hint which of two dozen sections to open.
 */
const NewComments = ({ comments }) => {
  const historic = useSelector(state => state.application && state.application.historicComments);

  if (!comments) {
    return null;
  }

  const label = comments === 1 ? 'comment' : 'comments';

  return (
    <span className={classnames('badge', 'comments', { historic })}>
      {historic ? `${comments} ${label}` : `${comments} new ${label}`}
    </span>
  );
};

export default NewComments;
