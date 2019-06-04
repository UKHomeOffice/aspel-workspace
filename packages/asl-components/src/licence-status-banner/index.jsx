import React, { Component } from 'react';
import Snippet from '../snippet';
import Link from '../link';
import classnames from 'classnames';
import formatDate from 'date-fns/format';

class LicenceStatusBanner extends Component {
  componentDidMount() {
    this.setState({ open: false });
  }

  toggle() {
    return this.setState({ open: !this.state.open });
  }

  isOpen() {
    return !this.state || this.state.open;
  }

  render() {
    const licence = this.props.licence;
    const licenceType = this.props.licenceType;
    const dateFormat = this.props.dateFormat;

    const isExpired = licence.status === 'expired';
    const isRevoked = licence.status === 'revoked';
    const isDraft = licence.draft || licence.status === 'inactive';
    const isAmendment = licence.granted && licence.openTasks && licence.openTasks.length > 0;

    return (
      <div className={classnames('licence-status-banner', licence.status, { open: this.isOpen() })}>
        <header onClick={() => this.toggle()}>
          <p className="toggle-switch">
            <a href="#">{this.isOpen() ? 'Show less' : 'Show more'}</a>
          </p>
          <p className="status">
            <Snippet>{`invalidLicence.status.${licence.status}`}</Snippet>
          </p>
        </header>

        <div className={classnames('status-details', { hidden: !this.isOpen() })}>
          { licence.issueDate &&
            <ul className="licence-dates">
              { (isRevoked || isExpired) && <li>Granted: <span className="date">{formatDate(licence.issueDate, dateFormat)}</span></li>}
              { isRevoked && licence.revocationDate && <li>Revoked: <span className="date">{formatDate(licence.revocationDate, dateFormat)}</span></li>}
              { isExpired && licence.expiryDate && <li>Expiry: <span className="date">{formatDate(licence.expiryDate, dateFormat)}</span></li>}
            </ul>
          }

          <p className="summary">
            { (isDraft || isExpired) && <Snippet>{`invalidLicence.summary.${licenceType}`}</Snippet> }
            { isAmendment && <p>
              <Snippet>{`invalidLicence.summary.${licenceType}_${licence.status}`}</Snippet>
              <p><Link page="project.version.read" versionId={this.props.licence.granted.id} label={<Snippet>{'invalidLicence.view'}</Snippet>} /></p>
            </p>
            }
          </p>
        </div>
      </div>
    );
  }
}

LicenceStatusBanner.defaultProps = {
  dateFormat: 'DD MMMM YYYY'
};

export default LicenceStatusBanner;
