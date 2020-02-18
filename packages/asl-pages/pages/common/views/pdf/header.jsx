import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import moment from 'moment';
import Wrapper from './wrapper';
import { LicenceStatusBanner } from '@asl/components';
import ProjectStatusBanner from '../../../project-version/components/project-status-banner';

const format = date => moment(date).format('DD MMM YY');

const Header = ({ store, model, licenceType, nonce, versionId }) => (
  <Wrapper name="header" nonce={nonce}>
    <Provider store={store}>
      <header>
        {
          licenceType === 'ppl'
            ? <ProjectStatusBanner model={model} versionId={versionId} />
            : <LicenceStatusBanner licence={model} licenceType={licenceType} />
        }

        <p className="float-left">OFFICIAL - SENSITIVE</p>

        <p className="float-right">
          <Fragment>{licenceType.toUpperCase()} number: <strong>{model.licenceNumber}</strong></Fragment>

          <Fragment> | Granted: <strong>{format(model.issueDate)}</strong></Fragment>

          { ['pil', 'pel'].includes(licenceType) && (moment(model.updatedAt).isAfter(model.issueDate, 'day')) &&
            <Fragment> | Amended: <strong>{format(model.updatedAt)}</strong></Fragment>
          }

          { licenceType === 'ppl' && model.amendedDate &&
            <Fragment> | Amended: <strong>{format(model.amendedDate)}</strong></Fragment>
          }

          { licenceType === 'ppl' && model.status !== 'expired' && model.status !== 'revoked' &&
            <Fragment> | Expires: <strong>{format(model.expiryDate)}</strong></Fragment>
          }

          { model.status === 'expired' &&
            <Fragment> | Expired: <strong>{format(model.expiryDate)}</strong></Fragment>
          }

          { model.status === 'revoked' &&
            <Fragment> | Revoked: <strong>{format(model.revocationDate)}</strong></Fragment>
          }
        </p>
      </header>
    </Provider>
  </Wrapper>
);

export default Header;
