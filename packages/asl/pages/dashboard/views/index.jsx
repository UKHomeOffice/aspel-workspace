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

const EstablishmentPanel = ({ establishment, profile }) => {
  return (
    <ExpandingPanel title={establishment.name} isOpen={profile.establishments.length === 1}>
      {
        establishment.role === 'blocked' &&
          <Snippet>establishment.blocked</Snippet>
      }

      {
        establishment.role !== 'blocked' &&
          <Fragment>
            <p><Snippet>establishment.description</Snippet></p>
            <p>
              <Link page="establishment" establishmentId={establishment.id} label={<Snippet name={establishment.name}>establishment.link</Snippet>} className="govuk-button truncate" />
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

const Index = ({ profile, pilReviewRequired, adminPilReviewsRequired }) => (
  <Fragment>
    {
      pilReviewRequired && (
        <Warning className="info">
          <Snippet {...pilReviewRequired}>warnings.pilReviewRequired</Snippet>
        </Warning>
      )
    }
    {
      adminPilReviewsRequired && adminPilReviewsRequired.map(review => (
        <Warning key={review.estId} className="info">
          <Snippet {...review}>warnings.adminPilReviewsRequired</Snippet>
          <p>
            <Link page="pils" establishmentId={review.estId} label="Go to personal licences" />
          </p>
        </Warning>
      ))
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
            <EstablishmentPanel key={establishment.id} establishment={establishment} profile={profile} />
          ))}
        />
      </Fragment>
    }
  </Fragment>
);

export default connect(({ static: { profile, pilReviewRequired, adminPilReviewsRequired } }) => ({ profile, pilReviewRequired, adminPilReviewsRequired }))(Index);
