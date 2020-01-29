import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import sortBy from 'lodash/sortBy';
import { Header, PanelList, Link, ExpandingPanel, Snippet } from '@asl/components';

import dateFormatter from 'date-fns/format';
import { dateFormat } from '@asl/pages/constants';

import Profile from '@asl/pages/pages/profile/read/views/profile';
import ASRUAdmin from '../components/asru-admin';
import Modules from '@asl/pages/pages/profile/read/views/modules';
import Tasklist from '@asl/pages/pages/task/list/views/table';

const formatDate = (date, format) => (date ? dateFormatter(date, format) : '-');

class Index extends React.Component {

  renderAsruAssociation (establishments) {
    return (<ul className="panel-list">
      {establishments.map(establishment => {
        return (
          <li key={establishment.id}>
            <Link page="establishment.dashboard" establishmentId={establishment.id} label={establishment.name} />
          </li>
        );
      })}
    </ul>);

  }

  render () {

    const model = this.props.model;
    const hasEstablishments = !!model.establishments.length;

    return <Fragment>
      <Header title={`${model.firstName} ${model.lastName}`} />
      <p className="float-right">
        <Link page="globalProfile.dedupe" className="govuk-button" label={<Snippet>dedupe</Snippet>} />
      </p>
      <dl>
        <dt>Email:</dt>
        <dd><a href={`mailto:${model.email}`}>{ model.email }</a></dd>
        {
          model.telephone && <Fragment>
            <dt>Telephone:</dt>
            <dd>{ model.telephone }</dd>
          </Fragment>
        }
        {
          model.dob && <Fragment>
            <dt>Date of birth:</dt>
            <dd>{ formatDate(model.dob, dateFormat.medium) }</dd>
          </Fragment>
        }

        <dt>Has login:</dt>
        <dd>{ model.userId ? 'Yes' : 'No' }</dd>
      </dl>
      <h2><Snippet>pil.training.title</Snippet></h2>
      {
        model.certificates && model.certificates.length > 0
          ? <Modules certificates={model.certificates} />
          : <p><em><Snippet>pil.training.none</Snippet></em></p>
      }

      <ASRUAdmin />

      {
        hasEstablishments && <Fragment>
          <h2>Establishments</h2>
          <PanelList panels={sortBy(model.establishments, 'name').map((establishment) => {
            return (
              <ExpandingPanel key={establishment.id} title={establishment.name} isOpen={model.establishments.length === 1}>
                <p>
                  <Link page="establishment.dashboard" establishmentId={establishment.id} label={<Snippet>establishment.link</Snippet>} />
                </p>
                <Profile establishment={establishment} profile={model} allowedActions={this.props.allowedActions} />
              </ExpandingPanel>
            );
          })} />
        </Fragment>
      }
      {
        model.asruInspector && model.asru && !!model.asru.length && <Fragment>
          <h3>Inspector for:</h3>
          { this.renderAsruAssociation(model.asru) }
        </Fragment>
      }
      {
        model.asruLicensing && model.asru && !!model.asru.length && <Fragment>
          <h3>Single Point of Contact (SPoC) for:</h3>
          { this.renderAsruAssociation(model.asru) }
        </Fragment>
      }
      <h2>Related tasks</h2>
      <Tasklist />
    </Fragment>;
  }

}

const mapStateToProps = ({ model, static: { allowedActions } }) => ({ model, allowedActions });

export default connect(mapStateToProps)(Index);
