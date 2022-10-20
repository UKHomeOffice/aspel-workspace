import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';
import {
  Link,
  Snippet,
  Header,
  PanelList,
  ExpandingPanel
} from '@asl/components';
import TaskList from '@asl/pages/pages/task/list/views/tasklist';
import Profile from '@asl/pages/pages/profile/read/views/profile';
import DashboardAlerts from './dashboard-alerts';

const Invitation = ({ token, establishment }) => (
  <Fragment>
    <p>
      <Link page="invitation" token={token} label={establishment} />
    </p>
  </Fragment>
);

const EstablishmentPanel = ({ establishment, profile }) => {
  if (establishment.suspendedDate) {
    establishment.status = 'suspended';
  }
  const title = <h3>
    {establishment.name}
    { establishment.status === 'inactive' && <span className="status-notice"><span className="badge">draft</span> establishment not yet licensed</span> }
    { establishment.status === 'revoked' && <span className="status-notice"><span className="badge rejected">revoked</span> establishment no longer licensed</span> }
    { establishment.status === 'suspended' && <span className="status-notice"><span className="badge rejected">suspended</span></span> }
  </h3>;

  return (
    <ExpandingPanel title={title} wrapTitle={false} isOpen={profile.establishments.length === 1}>
      {
        establishment.role === 'blocked' &&
          <Snippet>establishment.blocked</Snippet>
      }

      {
        establishment.role !== 'blocked' &&
          <Fragment>
            <p><Snippet>establishment.description</Snippet></p>
            <p>
              <Link page="establishment" establishmentId={establishment.id} label={<Snippet name={establishment.name}>establishment.link</Snippet>} className="govuk-button button-secondary truncate" />
            </p>
            <Profile
              establishment={establishment}
              profile={profile}
              allowedActions={profile.allowedActions[establishment.id]}
              isOwnProfile={true}
            />
          </Fragment>
      }
    </ExpandingPanel>
  );
};

export default function Index() {
  const { profile } = useSelector(state => state.static);
  return (
    <Fragment>
      <DashboardAlerts />
      <Header
        title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>}
      />
      {
        !!profile.invitations.length && <Fragment>
          <h2>{profile.invitations.length} pending invitation{profile.invitations.length === 1 ? '' : 's'}</h2>
          <PanelList panels={profile.invitations.map(invitation => <Invitation key={invitation.id} establishment={ invitation.establishment.name } token={invitation.token} />)}/>
        </Fragment>
      }
      <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
      <TaskList />
      {
        !!profile.establishments.length && <Fragment>
          <h2>Establishments</h2>
          <PanelList
            panels={sortBy(profile.establishments, 'name').map((establishment) => (
              <EstablishmentPanel key={establishment.id} establishment={establishment} profile={profile} />
            ))}
          />
        </Fragment>
      }
    </Fragment>
  );
}
