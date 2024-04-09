import React, { Fragment } from 'react';
import { Countdown } from '../';
import { format } from 'date-fns';

const ExpiryDate = ({ date, expiry, dateFormat, unit, showUrgent, showNotice }) => {
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

ExpiryDate.defaultProps = {
    dateFormat: 'dd MMMM yyyy',
    unit: 'month',
    showUrgent: 3,
    showNotice: true
};

export default ExpiryDate;
