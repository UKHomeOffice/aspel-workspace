import React, { Fragment } from 'react';
import { Snippet } from '../';
import differenceInMonths from 'date-fns/difference_in_months';
import differenceInWeeks from 'date-fns/difference_in_weeks';
import differenceInDays from 'date-fns/difference_in_calendar_days';
import isBefore from 'date-fns/is_before';
import format from 'date-fns/format';
import classnames from 'classnames';

const ExpiryDate = ({ date, expiry, dateFormat, unit, showUrgent, showNotice }) => {
  if (!date) {
    return null;
  }

  if (!expiry) {
    expiry = date;
  }

  const now = new Date();

  const diff = {
    day: differenceInDays(expiry, now),
    week: differenceInWeeks(expiry, now),
    month: differenceInMonths(expiry, now)
  };

  const displayUnit = diff['day'] <= 7 ? 'day' : (diff['day'] <= 28 ? 'week' : 'month');
  const displayDiff = displayUnit === 'day' ? diff[displayUnit] : diff[displayUnit] + 1;
  const urgent = displayDiff <= showUrgent;

  let contentKey = 'diff.standard';

  if (isBefore(expiry, now)) {
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
  showUrgent: 3,
  showNotice: 11
};

export default ExpiryDate;
