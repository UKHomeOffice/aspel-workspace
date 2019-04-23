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

  render() {
    const licence = this.props.licence;
    const licenceType = this.props.licenceType;
    const dateFormat = this.props.dateFormat;

    if (licence.status === 'active') {
      return null;
    }

    return (
      <div className={classnames('licence-status-banner', licence.status, this.isOpen() ? 'open' : '')}>
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
              <li>
                Granted: <span className="date">{formatDate(licence.issueDate, dateFormat)}</span>
              </li>
              { licence.revocationDate &&
                <li>
                  Revoked: <span className="date">{formatDate(licence.revocationDate, dateFormat)}</span>
                </li>
              }
              { !licence.revocationDate && licence.expiryDate &&
                <li>
                  Expiry: <span className="date">{formatDate(licence.expiryDate, dateFormat)}</span>
                </li>
              }
            </ul>
          }
          <p className="summary"><Snippet>{`invalidLicence.summary.${licenceType}`}</Snippet></p>
        </div>
      </div>
    );
  }
}

LicenceStatusBanner.defaultProps = {
  dateFormat: 'DD MMMM YYYY'
};

export default LicenceStatusBanner;
