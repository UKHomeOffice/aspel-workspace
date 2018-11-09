import React, { Fragment } from 'react';
import { Snippet } from '../';
import differenceInMonths from 'date-fns/difference_in_months';
import format from 'date-fns/format';
import classnames from 'classnames';

const ExpiryDate = ({ date, dateFormat }) => {
  const diff = differenceInMonths(date, new Date());
  const urgent = diff < 3;
  let contentKey = 'diff.standard';
  if (urgent) {
    contentKey = diff === 0 ? 'diff.singular' : 'diff.plural';
  }

  return (
    <Fragment>
      {format(date, dateFormat)}
      {diff < 12 && (
        <span className={classnames('notice', { urgent })}>
          <Snippet diff={diff + 1}>{contentKey}</Snippet>
        </span>
      )}
    </Fragment>
  );
};

ExpiryDate.defaultProps = {
  dateFormat: 'DD MMMM YYYY'
};

export default ExpiryDate;
