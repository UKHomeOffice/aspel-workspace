import React, { Fragment } from 'react';
import { connect } from 'react-redux';
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

const Invitation = ({ token, establishment }) => (
  <Fragment>
    <p>
      <Link page="invitation" token={token} label={establishment} />
    </p>
  </Fragment>
);

const Index = ({
  tabs,
  progress,
  profile,
  isOwnProfile
}) => {

  return <Fragment>
    <Header
      title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>}
    />

    <h3><Snippet>pages.dashboard.tasks</Snippet></h3>
    <TaskList tabs={ tabs } progress={ progress } />
    {
      !!profile.invitations.length && <Fragment>
        <h3>Pending Invitations</h3>
        <PanelList panels={profile.invitations.map(invitation => <Invitation key={invitation.id} establishment={ invitation.establishment.name } token={invitation.token} />)}/>
      </Fragment>
    }
    {
      !!profile.establishments.length && <Fragment>
        <h3>Establishments</h3>
        <PanelList panels={sortBy(profile.establishments, 'name').map(establishment => {
          return (
            <ExpandingPanel key={establishment.id} title={establishment.name}>
              <Profile establishment={establishment} profile={profile} allowedActions={profile.allowedActions[establishment.id]} isOwnProfile={isOwnProfile} />
            </ExpandingPanel>
          );
        })} />
      </Fragment>
    }

  </Fragment>;
};

const mapStateToProps = ({ static: { profile, tabs, progress, isOwnProfile } }) => ({ profile, tabs, progress, isOwnProfile });
export default connect(mapStateToProps)(Index);
