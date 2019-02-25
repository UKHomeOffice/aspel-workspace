import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Link,
  Snippet,
  Header,
  PanelList,
  ExpandingPanel
} from '@asl/components';
import TaskList from '@asl/pages/pages/task/list/views/tasklist';
import sortBy from 'lodash/sortBy';
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
  profile
}) => {

  return <Fragment>
    <Header
      title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>}
    />
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h3><Snippet>pages.dashboard.tasks</Snippet></h3>
        <TaskList tabs={ tabs } progress={ progress } />
        {
          !!profile.establishments.length && <Fragment>
            <h3>Establishments</h3>
            <PanelList panels={sortBy(profile.establishments, 'name').map(establishment => {
              return (
                <ExpandingPanel key={establishment.id} title={establishment.name}>
                  <Profile establishment={establishment} profile={profile} allowedActions={profile.allowedActions[establishment.id]}/>
                </ExpandingPanel>
              );
            })} />
          </Fragment>
        }
        {
          !!profile.invitations.length && <Fragment>
            <h3>Pending Invitations</h3>
            <PanelList panels={profile.invitations.map(invitation => <Invitation key={invitation.id} establishment={ invitation.establishment.name } token={invitation.token} />)}/>
          </Fragment>
        }
      </div>
    </div>
  </Fragment>;
};

const mapStateToProps = ({ static: { profile, tabs, progress, isUser } }) => ({ profile, tabs, progress, isUser });
export default connect(mapStateToProps)(Index);
