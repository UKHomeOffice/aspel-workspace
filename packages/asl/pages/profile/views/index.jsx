import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';
import { Header, PanelList, Link, ExpandingPanel, Snippet } from '@asl/components';

import dateFormatter from 'date-fns/format';
import { dateFormat } from '@asl/pages/constants';

import Profile from '@asl/pages/pages/profile/read/views/profile';
import Modules from '@asl/pages/pages/profile/read/views/modules';

const formatDate = (date, format) => (date ? dateFormatter(date, format) : '-');

export default function Index() {

  const { profile } = useSelector(state => state.static);

  const hasEstablishments = !!profile.establishments.length;

  return <Fragment>
    <Header title={`${profile.firstName} ${profile.lastName}`} />
    <dl>
      <dt>Email:</dt>
      <dd><a href={`mailto:${profile.email}`}>{ profile.email }</a> | <Link page="account.updateEmail" label="Edit" /></dd>
      {
        profile.telephone && <Fragment>
          <dt>Telephone:</dt>
          <dd>{ profile.telephone } | <Link page="account.update" label="Edit" /></dd>
        </Fragment>
      }
      {
        profile.dob && <Fragment>
          <dt>Date of birth:</dt>
          <dd>{ formatDate(profile.dob, dateFormat.medium) } | <Link page="account.update" label="Edit" /></dd>
        </Fragment>
      }
    </dl>
    <h2><Snippet>pil.training.title</Snippet></h2>
    {
      profile.certificates && profile.certificates.length > 0
        ? <Modules certificates={profile.certificates} />
        : <p><em><Snippet>pil.training.none</Snippet></em></p>
    }

    {
      hasEstablishments && <Fragment>
        <h2>Establishments</h2>
        <PanelList panels={sortBy(profile.establishments, 'name').map((establishment) => {
          return (
            <ExpandingPanel key={establishment.id} title={establishment.name} isOpen={profile.establishments.length === 1}>
              <p>
                <Link page="establishment.dashboard" establishmentId={establishment.id} label={<Snippet>establishment.link</Snippet>} />
              </p>
              <Profile establishment={establishment} profile={profile} allowedActions={profile.allowedActions[establishment.id]} />
            </ExpandingPanel>
          );
        })} />
      </Fragment>
    }
  </Fragment>;

}
