import React from 'react';
import { Snippet } from '../';
import { differenceInDays, differenceInMonths, differenceInWeeks, isBefore, isToday } from 'date-fns';
import classnames from 'classnames';

const Countdown = ({ expiry, unit, showNotice, showUrgent, contentPrefix = 'countdown' }) => {
    const now = new Date();

    const diff = {
        day: differenceInDays(expiry, now),
        week: differenceInWeeks(expiry, now),
        month: differenceInMonths(expiry, now)
    };

    if (showNotice !== true && diff[unit] > showNotice) {
        return null;
    }

    const displayUnit = diff['day'] <= 14 ? 'day' : (diff['week'] <= 13 ? 'week' : 'month');
    const displayDiff = Math.abs(displayUnit === 'day' ? diff[displayUnit] : diff[displayUnit] + 1);
    const urgent = diff[unit] <= showUrgent;

    let contentKey = displayDiff === 1 ? `${contentPrefix}.singular` : `${contentPrefix}.plural`;

    if (isBefore(expiry, now)) {
        contentKey = `${contentPrefix}.expired`;
    }

    if (isToday(expiry)) {
        contentKey = `${contentPrefix}.expiresToday`;
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
