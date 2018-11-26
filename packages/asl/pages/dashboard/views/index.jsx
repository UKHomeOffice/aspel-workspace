import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Link,
  Snippet,
  Header,
  PanelList
} from '@asl/components';
import TaskList from '@asl/pages/pages/task/list/views/tasklist';

const EstablishmentPanel = ({ id, name }) => (
  <Fragment>
    <p>
      <Link page="establishment.dashboard" establishmentId={id} label={name} />
    </p>
    <p>
      <Link page="profile.invite" establishmentId={id} label={<Snippet>pages.dashboard.invite</Snippet>}/>
    </p>
  </Fragment>
);

const Invitation = ({ token, establishment }) => (
  <Fragment>
    <p>
      <Link page="invitation" token={token} label={establishment} />
    </p>
  </Fragment>
);

const Index = ({
  profile: {
    firstName,
    establishments,
    invitations
  }
}) => {
  return <Fragment>
    <Header
      title={<Snippet name={firstName}>pages.dashboard.greeting</Snippet>}
    />
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
        <TaskList />

        {
          !!establishments.length && <Fragment>
            <h2>Establishments</h2>

            <PanelList panels={establishments.map(establishment => <EstablishmentPanel key={establishment.id} { ...establishment } />)}/>
          </Fragment>
        }
        {
          !!invitations.length && <Fragment>
            <h2>Pending Invitations</h2>
            <PanelList panels={invitations.map(invitation => <Invitation key={invitation.id} establishment={ invitation.establishment.name } token={invitation.token} />)}/>
          </Fragment>
        }
      </div>
    </div>
  </Fragment>
};

const mapStateToProps = ({ static: { profile } }) => ({ profile });
export default connect(mapStateToProps)(Index);
