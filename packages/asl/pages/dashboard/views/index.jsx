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
import { Warning } from '@ukhomeoffice/react-components';

const Invitation = ({ token, establishment }) => (
  <Fragment>
    <p>
      <Link page="invitation" token={token} label={establishment} />
    </p>
  </Fragment>
);

const Index = ({ profile, pilReviewRequired }) => (
  <Fragment>
    {
      pilReviewRequired && (
        <Warning className="info">
          <Snippet {...pilReviewRequired}>warnings.pilReviewRequired</Snippet>
        </Warning>
      )
    }
    <Header
      title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>}
    />
    {
      !!profile.invitations.length && <Fragment>
        <h2>{profile.invitations.length} pending invitation{profile.invitations.length === 1 ? '' : 's'}</h2>
        <PanelList panels={profile.invitations.map(invitation => <Invitation key={invitation.id} establishment={ invitation.establishment.name } token={invitation.token} />)}/>
      </Fragment>
    }
    <h3><Snippet>pages.dashboard.tasks</Snippet></h3>
    <TaskList />
    {
      !!profile.establishments.length && <Fragment>
        <h3>Establishments</h3>
        <PanelList
          panels={sortBy(profile.establishments, 'name').map((establishment) => (
            <ExpandingPanel key={establishment.id} title={establishment.name} isOpen={profile.establishments.length === 1}>
              <p><Snippet>establishment.description</Snippet></p>
              <p>
                <Link page="establishment" establishmentId={establishment.id} label={<Snippet>establishment.link</Snippet>} className="govuk-button" />
              </p>
              <Profile establishment={establishment} profile={profile} allowedActions={profile.allowedActions[establishment.id]} isOwnProfile={true} />
            </ExpandingPanel>
          ))}
        />
      </Fragment>
    }
  </Fragment>
);

export default connect(({ static: { profile, pilReviewRequired } }) => ({ profile, pilReviewRequired }))(Index);
