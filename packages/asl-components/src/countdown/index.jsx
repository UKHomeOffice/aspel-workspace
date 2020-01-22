import React from 'react';
import { Snippet } from '../';
import differenceInMonths from 'date-fns/difference_in_months';
import differenceInWeeks from 'date-fns/difference_in_weeks';
import differenceInDays from 'date-fns/difference_in_calendar_days';
import isBefore from 'date-fns/is_before';
import isToday from 'date-fns/is_today';
import classnames from 'classnames';

const Countdown = ({ expiry, unit, showNotice, showUrgent }) => {
  if (showNotice === false) {
    return null;
  }

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

  let contentKey = displayDiff === 1 ? 'countdown.singular' : 'countdown.plural';

  if (isBefore(expiry, now)) {
    contentKey = 'countdown.expired';
  }

  if (isToday(expiry)) {
    contentKey = 'countdown.expiresToday';
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
