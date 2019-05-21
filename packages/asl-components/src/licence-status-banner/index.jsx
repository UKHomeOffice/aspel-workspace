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

    if (licence.status === 'active' && licenceType !== 'ppl') {
      return null;
    }

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

          <p className="summary">
            { !(licence.status === 'active' && licenceType === 'ppl') && <Snippet>{`invalidLicence.summary.${licenceType}`}</Snippet> }
            { licence.status === 'active' && licenceType === 'ppl' && <p>
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
