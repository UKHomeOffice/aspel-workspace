import React, { Fragment } from 'react';
import dayJs from '../dayjs.js';
import { Countdown } from '../';
import { DATE_FORMAT } from '../utils';

const { format } = dayJs;

const ExpiryDate = ({
    date,
    expiry,
    dateFormat = DATE_FORMAT.long,
    unit = 'month',
    showUrgent = 3,
    showNotice = true
}) => {
    if (!date) {
        return null;
    }

    if (!expiry) {
        expiry = date;
    }

    return (
        <Fragment>
            { format(date, dateFormat) }
            {
                showNotice !== false &&
        <Countdown expiry={expiry} unit={unit} showUrgent={showUrgent} showNotice={showNotice} />
            }
        </Fragment>
    );
};

export default ExpiryDate;

