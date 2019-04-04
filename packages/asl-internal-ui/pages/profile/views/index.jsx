import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import sortBy from 'lodash/sortBy';
import { Header, PanelList, Link, ExpandingPanel, Snippet } from '@asl/components';

import dateFormatter from 'date-fns/format';
import { dateFormat } from '@asl/pages/constants';

import Profile from '@asl/pages/pages/profile/read/views/profile';
import ASRUAdmin from '../components/asru-admin';

class Index extends React.Component {

  render () {

    const model = this.props.model;
    const hasEstablishments = !!model.establishments.length;
    return <Fragment>
      <Header title={`${model.firstName} ${model.lastName}`} />
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
            <dd>{ dateFormatter(model.dob, dateFormat.medium) }</dd>
          </Fragment>
        }
      </dl>

      <ASRUAdmin />

      {
        hasEstablishments && <Fragment>
          <h3>Establishments</h3>
          <PanelList panels={sortBy(model.establishments, 'name').map(establishment => {
            return (
              <ExpandingPanel key={establishment.id} title={establishment.name}>
                <p>
                  <Link page="establishment.dashboard" establishmentId={establishment.id} label={<Snippet>establishment.link</Snippet>} />
                </p>
                <Profile establishment={establishment} profile={model} allowedActions={[]} />
              </ExpandingPanel>
            );
          })} />
        </Fragment>
      }

    </Fragment>;
  }

}

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(Index);
