import React, { Fragment } from 'react';
import { Snippet } from '../';
import differenceInMonths from 'date-fns/difference_in_months';
import differenceInWeeks from 'date-fns/difference_in_weeks';
import differenceInDays from 'date-fns/difference_in_calendar_days';
import isBefore from 'date-fns/is_before';
import format from 'date-fns/format';
import classnames from 'classnames';

const ExpiryDate = ({ date, dateFormat, unit, adjustment, showUrgent, showNotice }) => {
  if (!date) {
    return null;
  }

  const now = new Date();

  const diff = {
    day: differenceInDays(date, now) + adjustment,
    week: differenceInWeeks(date, now) + adjustment,
    month: differenceInMonths(date, now) + adjustment
  };

  const displayUnit = diff['month'] > 0 ? 'month' : (diff['week'] > 0 ? 'week' : 'day');
  const displayDiff = diff['month'] > 0 ? diff['month'] : (diff['week'] > 0 ? diff['week'] : diff['day']);
  const urgent = diff[unit] <= showUrgent;

  let contentKey = 'diff.standard';

  if (isBefore(date, new Date())) {
    contentKey = 'diff.expired';
  } else if (urgent) {
    contentKey = displayDiff === 1 ? 'diff.singular' : 'diff.plural';
  }

  return (
    <Fragment>
      {format(date, dateFormat)}
      {diff[unit] <= showNotice && (
        <span className={classnames('notice', { urgent })}>
          <Snippet diff={displayDiff} unit={displayUnit}>{contentKey}</Snippet>
        </span>
      )}
    </Fragment>
  );
};

ExpiryDate.defaultProps = {
  dateFormat: 'DD MMMM YYYY',
  unit: 'month',
  adjustment: 0,
  showUrgent: 3,
  showNotice: 11
};

export default ExpiryDate;
