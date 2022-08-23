import React, { Component } from 'react';
import Snippet from '../snippet';
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

  renderDates(status) {
    const {
      issueDate,
      revocationDate,
      expiryDate,
      suspendedDate
    } = this.props.licence;

    const isPdf = this.props.isPdf;
    const dateFormat = this.props.dateFormat;

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
  }

  render() {
    const licence = this.props.licence;
    const licenceType = this.props.licenceType;
    const licenceStatus = licence.suspendedDate ? 'suspended' : licence.status;

    if (!this.props.children && licenceStatus === 'active') {
      return null;
    }

    return (
      <div className={classnames('licence-status-banner', licenceStatus, this.props.colour, { open: this.isOpen() })}>
        <header onClick={() => this.toggle()}>
          <p className="toggle-switch">
            <a href="#">{this.isOpen() ? 'Show less' : 'Show more'}</a>
          </p>
          <p className="status">
            {
              this.props.title || <Snippet>{`invalidLicence.status.${licenceStatus}`}</Snippet>
            }
          </p>
        </header>

        <div className={classnames('status-details', { hidden: !this.isOpen() })}>
          {
            this.renderDates(licenceStatus)
          }
          {
            this.props.children || <p><Snippet>{`invalidLicence.summary.${licenceType}`}</Snippet></p>
          }
        </div>
      </div>
    );
  }
}

LicenceStatusBanner.defaultProps = {
  dateFormat: 'DD MMMM YYYY'
};

export default LicenceStatusBanner;
