import React, { useState, useEffect } from 'react';
import Snippet from '../snippet';
import classnames from 'classnames';
import { format } from 'date-fns';

function LicenceStatusBanner({ licence, licenceType, isPdf, dateFormat='dd MMMM yyyy', colour, title, suspendedEstablishment, children }) {
    const [open, setOpen] = useState(true);
    const establishment = suspendedEstablishment || licence.establishment;
    const establishmentSuspended = !!(licence.status === 'active' && !licence.suspendedDate && establishment && establishment.suspendedDate);
    const suspendedDate = establishmentSuspended ? establishment.suspendedDate : licence.suspendedDate;
    let licenceStatus = licence.status;

    if (licenceStatus === 'active' && suspendedDate) {
        licenceStatus = 'suspended';
    }

    useEffect(() => setOpen(false), []);

    const toggle = () => setOpen(!open);

    const renderDates = status => {
        const { issueDate, revocationDate, expiryDate } = licence;

        if (isPdf || !['revoked', 'expired', 'suspended'].includes(status)) {
            return null;
        }

        return <ul className="licence-dates">
            {
                issueDate != null && <li>Granted: <span className="date">{format(issueDate, dateFormat)}</span></li>
            }
            {
                status === 'revoked' && revocationDate != null && <li>
                    Revoked: <span className="date">{format(revocationDate, dateFormat)}</span>
                </li>
            }
            {
                status === 'expired' && expiryDate != null && <li>
                    Expiry: <span className="date">{format(expiryDate, dateFormat)}</span>
                </li>
            }
            {
                status === 'suspended' && suspendedDate != null && <li>
                    Suspended: <span className="date">{format(suspendedDate, dateFormat)}</span>
                </li>
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
                    { title || <Snippet>{`invalidLicence.status.${establishmentSuspended ? 'establishmentSuspended' : licenceStatus}`}</Snippet> }
                </p>
            </header>

            <div className={classnames('status-details', { hidden: !open })}>
                { renderDates(licenceStatus) }
                { children }
                {
                    !children && (
                        establishmentSuspended
                            ? <p><Snippet establishmentName={establishment.name}>{'invalidLicence.summary.establishmentSuspended'}</Snippet></p>
                            : <p><Snippet>{`invalidLicence.summary.${licenceType}`}</Snippet></p>
                    )
                }
            </div>
        </div>
    );
}

export default LicenceStatusBanner;
