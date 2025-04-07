/* eslint-disable react/display-name */

import React, { Fragment } from 'react';
import { Link } from '../';

export default ({
    page,
    label,
    completed,
    children
}) => (
    <Fragment>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-three-quarters">
                <h3><Link page={page} label={label} /></h3>
            </div>
            <div className="govuk-grid-column-one-quarter">
                { completed && <label className="status-label completed">Completed</label> }
            </div>
        </div>
        { children }
    </Fragment>
);
