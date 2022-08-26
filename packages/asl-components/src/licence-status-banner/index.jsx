import React, { useState } from 'react';
import Snippet from '../snippet';
import classnames from 'classnames';
import formatDate from 'date-fns/format';

function LicenceStatusBanner({ licence, licenceType, isPdf, dateFormat, colour, title, children }) {
  const [open, setOpen] = useState(false);

  const establishment = licence.establishment;
  const licenceStatus = licence.suspendedDate || establishment.suspendedDate ? 'suspended' : licence.status;

  const toggle = () => setOpen(!open);

  const renderDates = status => {
    const { issueDate, revocationDate, expiryDate, establishment } = licence;
    const suspendedDate = licence.suspendedDate || establishment.suspendedDate;

    if (isPdf || !['revoked', 'expired', 'suspended'].includes(status)) {
      return null;
    }

    return <ul className="licence-dates">
      <li>Granted: <span className="date">{formatDate(issueDate, dateFormat)}</span></li>
      {
        status === 'revoked' && <li>Revoked: <span className="date">{formatDate(revocationDate, dateFormat)}</span></li>
      }
      {
        status === 'expired' && <li>Expiry: <span className="date">{formatDate(expiryDate, dateFormat)}</span></li>
      }
      {
        status === 'suspended' && <li>Suspended: <span className="date">{formatDate(suspendedDate, dateFormat)}</span></li>
      }
    </ul>;
  };

  if (!children && licenceStatus === 'active') {
    return null;
  }

  return (
    <div className={classnames('licence-status-banner', licenceStatus, colour, { open })}>
      <header onClick={() => toggle()}>
        <p className="toggle-switch">
          <a href="#">{open ? 'Show less' : 'Show more'}</a>
        </p>
        <p className="status">
          { title || <Snippet>{`invalidLicence.status.${licenceStatus}`}</Snippet> }
        </p>
      </header>

      <div className={classnames('status-details', { hidden: !open })}>
        { renderDates(licenceStatus) }
        { children || <p><Snippet>{`invalidLicence.summary.${licenceType}`}</Snippet></p> }
      </div>
    </div>
  );
}

LicenceStatusBanner.defaultProps = {
  dateFormat: 'DD MMMM YYYY'
};

export default LicenceStatusBanner;
