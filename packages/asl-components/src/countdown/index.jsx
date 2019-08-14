import React from 'react';
import { Snippet } from '../';
import differenceInMonths from 'date-fns/difference_in_months';
import differenceInWeeks from 'date-fns/difference_in_weeks';
import differenceInDays from 'date-fns/difference_in_calendar_days';
import isBefore from 'date-fns/is_before';
import classnames from 'classnames';

const Countdown = ({ expiry, unit, showNotice, showUrgent }) => {
  const now = new Date();

  const diff = {
    day: differenceInDays(expiry, now),
    week: differenceInWeeks(expiry, now),
    month: differenceInMonths(expiry, now)
  };

  if (showNotice !== true && diff[unit] > showNotice) {
    return null;
  }

  const displayUnit = diff['day'] <= 7 ? 'day' : (diff['day'] <= 28 ? 'week' : 'month');
  const displayDiff = displayUnit === 'day' ? diff[displayUnit] : diff[displayUnit] + 1;
  const urgent = diff[unit] <= showUrgent;

  let contentKey = displayDiff === 1 ? 'diff.singular' : 'diff.plural';

  if (isBefore(expiry, now)) {
    contentKey = 'diff.expired';
  }

  return (
    <span className={classnames('notice', { urgent })}>
      <Snippet diff={displayDiff} unit={displayUnit}>{contentKey}</Snippet>
    </span>
  );
};

Countdown.defaultProps = {
  unit: 'month',
  showNotice: true,
  showUrgent: 3
};

export default Countdown;
