import React, { Fragment } from 'react';
import { Countdown } from '../';
import differenceInMonths from 'date-fns/difference_in_months';
import differenceInWeeks from 'date-fns/difference_in_weeks';
import differenceInDays from 'date-fns/difference_in_calendar_days';
import format from 'date-fns/format';

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

  return (
    <Fragment>
      { format(date, dateFormat) }
      {
        diff[unit] <= showNotice &&
          <Countdown expiry={expiry} unit={unit} showUrgent={showUrgent} />
      }
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
