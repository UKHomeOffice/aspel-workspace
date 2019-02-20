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
import PilApply from '@asl/pages/pages/profile/read/views/pil-apply';

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
  isUser,
  allowedActions,
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
    postcode
  }
}) => {

  console.log('----------------PilApply---------------------');
  console.log(JSON.stringify(PilApply));
  console.log('-------------------------------------');

  console.log('----------------TaskList---------------------');
  console.log(JSON.stringify(TaskList));
  console.log('-------------------------------------');

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
                  <p>
                    <Link page="establishment.dashboard" establishmentId={establishment.id} label='About this establishment' />
                  </p>
                  <div className='separator' />
                  <h3><Snippet>projects.title</Snippet></h3>
                  {
                    projects && projects.length > 0 && (
                      <dl>
                        {
                          projects.map(project =>
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
                  {/* TODO: replace with PPLApply */}
                  <PilApply pil={pil} />
                  <div className='separator' />
                  <h3><Snippet>responsibilities.title</Snippet></h3>
                  {!isEmpty(roles) &&
                      <dl>
                        {
                          roles.map(({ type, id }) => <Fragment key={id}>
                            <dd>{defineValue(type.toUpperCase())}</dd>
                          </Fragment>)
                        }
                      </dl>
                  }
                  { isEmpty(roles) && <Snippet>responsibilities.noRoles</Snippet> }
                  <div className='separator' />
                  {
                    pil && pil.licenceNumber && (
                      <Fragment>
                        <dt><Snippet>personalLicenceNumber</Snippet></dt>
                        <dd><Link page="pil.read" pilId={pil.id} label={pil.licenceNumber} /></dd>
                      </Fragment>
                    )
                  }
                  <div className='separator' />
                  {
                    (address || telephone || email) && (
                      <Fragment>
                        <Snippet>contactDetails.title</Snippet>
                        <dl>
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
                          {
                            email && (
                              <Fragment>
                                <dt><Snippet>contactDetails.email</Snippet></dt>
                                <dd><a href={`mailto:${email}`}>{email}</a></dd>
                              </Fragment>
                            )
                          }
                        </dl>
                      </Fragment>
                    )
                  }
                  {
                    !isUser && allowedActions.includes('profile.permissions') && (
                      <Fragment>
                        {/* <dt>{profileRole}</dt> */}
                        <dd><Link page="profile.permission" label={<Snippet>pages.profile.permission.change</Snippet>} /></dd>
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
