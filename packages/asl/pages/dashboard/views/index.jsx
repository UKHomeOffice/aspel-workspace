import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';
import {
  Link,
  Snippet,
  Header,
  PanelList,
  ExpandingPanel,
  Markdown
} from '@asl/components';
import { getUrl } from '@asl/components/src/link';
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
  const title = <h3>
    {establishment.name}
    { establishment.status === 'inactive' && <span className="status-notice">(draft - establishment not yet licensed)</span> }
    { establishment.status === 'revoked' && <span className="status-notice">(revoked - establishment no longer licensed)</span> }
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

const getWarningText = review => {
  let warningText = `${review.name} has `;

  if (review.overdue > 0) {
    if (review.overdue === 1) {
      warningText = `${warningText}**${review.overdue} licence that is overdue** its PIL review`;
    } else {
      warningText = `${warningText}**${review.overdue} licences that are overdue** their PIL review`;
    }
  }

  if (review.due > 0) {
    warningText = review.overdue ? `${warningText} and ` : warningText;
    if (review.due === 1) {
      warningText = `${warningText}${review.due} licence approaching its deadline`;
    } else {
      warningText = `${warningText}${review.due} licences approaching their deadline`;
    }
  }

  return `${warningText}.`;
};

export default function Index() {
  const { profile, pilReviewRequired, adminPilReviewsRequired, rasDue } = useSelector(state => state.static);
  return (
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
            <Markdown>{getWarningText(review)}</Markdown>
            <p>
              <Link page="pils" establishmentId={review.estId} label="Go to personal licences" />
            </p>
          </Warning>
        ))
      }
      {
        rasDue && rasDue.map(ra => {
          const query = {
            status: 'inactive-statuses',
            filters: {
              'retrospective-assessment': ['outstanding']
            }
          };
          const url = getUrl({ page: 'project.list', establishmentId: ra.estId, query });

          return (
            <Warning key={ra.estId} className="info">
              <Markdown>{`${ra.name} has ${ra.due} [projects due a retrospective assessment](${url}) in less than a month.`}</Markdown>
            </Warning>
          );
        })
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
