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
import format from 'date-fns/format';
import { isEmpty, sortBy } from 'lodash';
import dict from '@asl/dictionary';
import { Button } from '@ukhomeoffice/react-components';

const Invitation = ({ token, establishment }) => (
  <Fragment>
    <p>
      <Link page="invitation" token={token} label={establishment} />
    </p>
  </Fragment>
);

const defineValue = val => `${dict[val.toUpperCase()]} (${val})`;

const Index = ({
  tabs,
  progress,
  profile: {
    firstName,
    establishments,
    invitations,
    projects,
    roles,
    pil,
    address,
    telephone,
    email,
    postcode,
    allowedActions,
    id
  }
}) => {

  return <Fragment>
    <Header
      title={<Snippet name={firstName}>pages.dashboard.greeting</Snippet>}
    />
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h2><Snippet>pages.dashboard.tasks</Snippet></h2>
        <TaskList tabs={ tabs } progress={ progress } />
        {
          !!establishments.length && <Fragment>
            <h2>Establishments</h2>
            <PanelList panels={sortBy(establishments, 'name').map(establishment => {

              return (
                <ExpandingPanel key={establishment.id} title={establishment.name}>
                  <p><Link page="establishment.dashboard" establishmentId={establishment.id} label='About this establishment' /></p>
                  <div className='separator' />

                  <h3><Snippet>projects.title</Snippet></h3>

                  <Fragment>
                    {
                      projects && !isEmpty(projects.filter(({ establishmentId }) => establishmentId === establishment.id)) && (
                        <dl>
                          {
                            projects.filter(({ establishmentId }) => establishmentId === establishment.id).map(project =>
                              <Fragment key={project.id}>
                                <dd>
                                  <Link page="project.list" establishmentId={establishment.id} label={project.title} />
                                </dd>
                                <dd>
                                  <span><Snippet licenceNumber={project.licenceNumber}>projects.licenceNumber</Snippet></span>
                                </dd>
                                <dd>
                                  <span><Snippet expiryDate={format(project.expiryDate, 'DD MMMM YYYY')}>projects.expiryDate</Snippet></span>
                                </dd>
                              </Fragment>
                            )
                          }
                        </dl>
                      )
                    }
                    {
                      projects && isEmpty(projects.filter(({ establishmentId }) => establishmentId === establishment.id)) &&
                        <p><Snippet>projects.noProjects</Snippet></p>
                    }
                    {
                      allowedActions[establishment.id].includes('project.apply') && (
                        <form method="POST" action={`/e/${establishment.id}/projects/create`}>
                          <Button className="govuk-button add-margin"><Snippet>buttons.pplApply</Snippet></Button>
                        </form>
                      )
                    }
                  </Fragment>
                  <div className='separator' />

                  <h3><Snippet>responsibilities.title</Snippet></h3>
                  <Fragment>
                    {!isEmpty(roles.filter(({ establishmentId }) => establishmentId === establishment.id)) &&
                      <dl>
                        {
                          roles.filter(({ establishmentId }) => establishmentId === establishment.id).map(({ type, id }) => <Fragment key={id}>
                            <dd>{defineValue(type.toUpperCase())}</dd>
                          </Fragment>)
                        }
                      </dl>
                    }
                    {
                      isEmpty(roles.filter(({ establishmentId }) => establishmentId === establishment.id)) && <Snippet>responsibilities.noRoles</Snippet>
                    }
                    {
                      <p><Link
                        page='profile.role.apply.base' establishmentId={establishment.id} profileId={id}
                        className="govuk-button"
                        label={<Snippet>{`buttons.roleApply`}</Snippet>}
                      /></p>
                    }
                  </Fragment>

                  <div className='separator' />

                  <h3><Snippet>pil.title</Snippet></h3>
                  <Fragment>
                    {
                      pil && pil.licenceNumber && (
                        <dl>
                          <dt><Snippet>personalLicenceNumber</Snippet></dt>
                          <dd><Link page="pil.read" establishmentId={establishment.id} profileId={id} pilId={pil.id} label={pil.licenceNumber} /></dd>
                        </dl>
                      )
                    }
                    { !pil && <p className="add-margin"><Snippet>pil.noPil</Snippet></p> }
                    { !pil && allowedActions[establishment.id].includes('pil.create') &&
                        <p><Link
                          page='pil.create' establishmentId={establishment.id} profileId={id}
                          className="govuk-button"
                          label={<Snippet>{`buttons.pilApply`}</Snippet>}
                        /></p>
                    }
                  </Fragment>
                  <div className='separator' />

                  <h3><Snippet>contactDetails.title</Snippet></h3>
                  {
                    (address || telephone || email) && (
                      <Fragment>
                        <dl>
                          {
                            email && (
                              <Fragment>
                                <dt><Snippet>contactDetails.email</Snippet></dt>
                                <dd><a href={`mailto:${email}`}>{email}</a></dd>
                              </Fragment>
                            )
                          }
                          {
                            address && (
                              <Fragment>
                                <dt><Snippet>contactDetails.professionalAddress</Snippet></dt>
                                <dd>{address}<br />{postcode}</dd>
                              </Fragment>
                            )
                          }
                          {
                            telephone && (
                              <Fragment>
                                <dt><Snippet>contactDetails.telephone</Snippet></dt>
                                <dd>{telephone}</dd>
                              </Fragment>
                            )
                          }
                        </dl>
                      </Fragment>
                    )
                  }

                </ExpandingPanel>);
            })} />
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
  </Fragment>;
};

const mapStateToProps = ({ static: { profile, tabs, progress, isUser, allowedActions } }) => ({ profile, tabs, progress, isUser, allowedActions });
export default connect(mapStateToProps)(Index);
