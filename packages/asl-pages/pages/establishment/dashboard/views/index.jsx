import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Snippet,
  Link,
  Sidebar,
  Header,
  PanelList,
  LicenceStatusBanner
} from '@asl/components';
import ProfileLink from '../../components/profile-link';

const links = [
  { page: 'establishment.read', permissions: 'establishment.read' },
  { page: 'place.list', permissions: 'place.list' },
  { page: 'profile.list', permissions: 'profile.read.basic' },
  { page: 'pils', permissions: 'pil.list' },
  { page: 'project.list', permissions: 'project.read.basic' },
  { page: 'establishment.fees.overview', permissions: 'establishment.licenceFees' }
];

function getContentKey(page, route) {
  if (route) {
    return `${page}.${route}`;
  }
  return page;
}

function DashboardLink ({ page, route, ...params }) {
  return (
    <Fragment>
      <Link
        page={page}
        label={<Snippet>{`pages.${getContentKey(page, route)}`}</Snippet>}
        {...params}
      />
      <p><Snippet>{`dashboard.${getContentKey(page, route)}.subtitle`}</Snippet></p>
    </Fragment>
  );
}

const Index = ({
  establishment,
  allowedActions,
  asruAdmin
}) => {
  const inspectors = establishment.asru.filter(p => p.asruUser && p.asruInspector);
  const spocs = establishment.asru.filter(p => p.asruUser && p.asruLicensing);
  const openApplication = allowedActions.includes('establishment.update') && establishment.openTasks.find(task => task.data && task.data.model === 'establishment' && task.data.action === 'grant');
  const canApply = establishment.status !== 'active' && allowedActions.includes('establishment.update') && !openApplication;

  return (
    <Fragment>
      <LicenceStatusBanner licence={establishment} licenceType="pel" />

      <Header title={establishment.name} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <PanelList
            panels={links.filter(link => allowedActions.includes(link.permissions)).map((link, index) => <DashboardLink key={index} { ...link } />)}
          />
          {
            canApply &&
              <Link page="establishment.apply" label={<Snippet>buttons.establishment.apply</Snippet>} className="govuk-button" />
          }
          {
            openApplication &&
              <Fragment>
                <p><Snippet>applicationInProgress</Snippet></p>
                <p><Link page="task.read" className="govuk-button button-secondary" taskId={openApplication.id} label="View task" /></p>
              </Fragment>
          }
        </div>
        <Sidebar>
          <dl>
            <dt><Snippet>establishmentLicenceNumber</Snippet></dt>
            <dd>{ establishment.licenceNumber || '-' }</dd>

            {
              establishment.pelh && <ProfileLink type="pelh" profile={establishment.pelh} />
            }
            {
              establishment.nprc && <ProfileLink type="nprc" profile={establishment.nprc} />
            }

            {
              !!establishment.holc.length &&
                <Fragment>
                  <dt><Snippet>holc</Snippet></dt>
                  <dd>
                    {
                      establishment.holc.map(holc => (
                        <p key={holc.id} className="holc">
                          <Link page="profile.read" profileId={holc.profile.id} label={`${holc.profile.firstName} ${holc.profile.lastName}`} />
                        </p>
                      ))
                    }
                  </dd>
                </Fragment>
            }

            <dt><Snippet>inspectors</Snippet></dt>
            <dd>
              { inspectors.length < 1 &&
                <p className="inspector">None</p>
              }

              {
                !asruAdmin && inspectors.map(inspector => (
                  <p key={`${inspector.id}`} className="inspector">{`${inspector.firstName} ${inspector.lastName}`}</p>
                ))
              }

              {
                asruAdmin && inspectors.map(inspector => (
                  <p key={`${inspector.id}`} className="inspector">
                    <Link page="globalProfile" profileId={inspector.id} label={`${inspector.firstName} ${inspector.lastName}`} />
                  </p>
                ))
              }

              { asruAdmin &&
                <Link page="establishment.asru" asruUser="inspectors" label={ <Snippet>pages.edit</Snippet> } />
              }
            </dd>

            <dt><Snippet>spoc</Snippet></dt>
            <dd>
              { spocs.length < 1 &&
                <p className="spoc">None</p>
              }

              {
                !asruAdmin && spocs.map(spoc => (
                  <p key={`${spoc.id}`} className="spoc">{`${spoc.firstName} ${spoc.lastName}`}</p>
                ))
              }

              {
                asruAdmin && spocs.map(spoc => (
                  <p key={`${spoc.id}`} className="spoc">
                    <Link page="globalProfile" profileId={spoc.id} label={`${spoc.firstName} ${spoc.lastName}`} />
                  </p>
                ))
              }

              { asruAdmin &&
                <Link page="establishment.asru" asruUser="spocs" label={ <Snippet>pages.edit</Snippet> } />
              }
            </dd>

            {
              allowedActions.includes('establishment.sharedKey') && establishment.sharedKey &&
                <Fragment>
                  <dt><Snippet>sharedKey</Snippet></dt>
                  <dd>{establishment.sharedKey}</dd>
                </Fragment>
            }
          </dl>
        </Sidebar>
      </div>
    </Fragment>
  )
  ;
};

const mapStateToProps = ({ static: { establishment, allowedActions, profile } }) => ({ establishment, allowedActions, asruAdmin: profile.asruUser && profile.asruAdmin });

export default connect(mapStateToProps)(Index);
