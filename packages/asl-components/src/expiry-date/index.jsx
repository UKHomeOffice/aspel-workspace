import React, { Fragment } from 'react';
import { Snippet } from '../';
import differenceInMonths from 'date-fns/difference_in_months';
import differenceInWeeks from 'date-fns/difference_in_weeks';
import differenceInDays from 'date-fns/difference_in_days';
import format from 'date-fns/format';
import classnames from 'classnames';

const ExpiryDate = ({
  date,
  dateFormat,
  unit = 'month',
  adjustment = 0,
  showUrgent = 3,
  showNotice = 11
}) => {
  let differenceFunction;
  switch (unit) {
    case 'month':
      differenceFunction = differenceInMonths;
      break;
    case 'week':
      differenceFunction = differenceInWeeks;
      break;
    case 'day':
      differenceFunction = differenceInDays;
      break;
  }
  const diff = differenceFunction(date, new Date()) + adjustment;
  const urgent = diff < showUrgent;

  let contentKey = 'diff.standard';

  if (urgent) {
    contentKey = diff === 0 ? 'diff.singular' : 'diff.plural';
  }
  if (diff < 0) {
    contentKey = 'diff.expired';
  }

  return (
    <Fragment>
      {format(date, dateFormat)}
      {diff <= showNotice && (
        <span className={classnames('notice', { urgent })}>
          <Snippet diff={diff}>{contentKey}</Snippet>
        </span>
      )}
    </Fragment>
  );
};

ExpiryDate.defaultProps = {
  dateFormat: 'DD MMMM YYYY'
};

export default ExpiryDate;
