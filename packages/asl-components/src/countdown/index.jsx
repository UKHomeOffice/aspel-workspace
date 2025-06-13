import React, { useMemo } from 'react';
import { Snippet } from '../';
import {
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    isBefore,
    isToday
} from 'date-fns';
import classNames from 'classnames';

const Countdown = ({
    expiry,
    unit = 'month',
    showNotice = true,
    showUrgent = 3,
    contentPrefix = 'countdown'
}) => {
    const { now, diff } = useMemo(() => {
        const now = new Date();
        return {
            now,
            diff: {
                day: differenceInDays(expiry, now),
                week: differenceInWeeks(expiry, now),
                month: differenceInMonths(expiry, now)
            }
        };
    }, [expiry]);

    if (showNotice !== true && diff[unit] > showNotice) {
        return null;
    }

    const displayUnit = diff.day <= 14 ? 'day' : (diff.week <= 13 ? 'week' : 'month');
    const displayDiff = Math.abs(displayUnit === 'day'
        ? diff[displayUnit]
        : diff[displayUnit] + 1);

    const urgent = isToday(expiry) || isBefore(expiry, now) || diff[unit] <= showUrgent;

    let contentKey = `${contentPrefix}.plural`;
    if (displayDiff === 1) {
        contentKey = `${contentPrefix}.singular`;
    }
    if (isToday(expiry)) {
        contentKey = `${contentPrefix}.expiresToday`;
    } else if (isBefore(expiry, now)) {
        contentKey = `${contentPrefix}.expired`;
    }

    return (
        <span className={classNames('notice', { urgent })}>
            <Snippet diff={displayDiff} unit={displayUnit}>
                {contentKey}
            </Snippet>
        </span>
    );
};

export default Countdown;
