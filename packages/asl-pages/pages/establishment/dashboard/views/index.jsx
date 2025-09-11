import React, { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';
import {
  Snippet,
  Link,
  Sidebar,
  DocumentHeader,
  PanelList,
  LicenceStatusBanner
} from '@ukhomeoffice/asl-components';
import ProfileLink from '../../components/profile-link';
import EnforcementFlags from '../../../enforcement/components/enforcement-flags';
import { FEATURE_FLAG_CAT_E, useFeatureFlags } from '@asl/service/ui/feature-flag';

const links = [
  { page: 'establishment.read', permissions: 'establishment.read' },
  { page: 'place.list', permissions: 'place.list' },
  { page: 'profile.list', permissions: 'profile.read.basic' },
  {
    page: 'course.list',
    permissions: 'trainingCourse.read',
    conditions: (establishment) => establishment.isTrainingEstablishment,
    featureFlag: FEATURE_FLAG_CAT_E
  },
  { page: 'pils', permissions: 'pil.list' },
  { page: 'project.list', permissions: 'project.read.basic' },
  { page: 'establishment.rops', permissions: 'establishment.rops' },
  { page: 'establishment.fees.overview', permissions: 'establishment.licenceFees' }
];

function getContentKey(page, route) {
  if (route) {
    return `${page}.${route}`;
  }
  return page;
}

function DashboardLink ({ page, route, ...params }) {
  const contentKey = getContentKey(page, route);
  return (
    <Fragment>
      <Link
        page={page}
        label={<Snippet>{`pages.${contentKey}`}</Snippet>}
        {...params}
      />
      <Snippet isPtag={false}>{`dashboard.${contentKey}.subtitle`}</Snippet>
    </Fragment>
  );
}

export default function Index() {
  const { establishment, allowedActions, profile } = useSelector(state => state.static);
  const hasFeatureFlag = useFeatureFlags();

  const asruUser = profile.asruUser;
  const holcs = useMemo(
    () => sortBy(establishment.holc, p => p.profile.lastName),
    [establishment.holc]
  );
  const openApplication = useMemo(
    () =>
      allowedActions.includes('establishment.update') &&
      establishment.openTasks.find(
        task => task.data && task.data.model === 'establishment' && task.data.action === 'grant'
      ),
    [allowedActions, establishment.openTasks]
  );
  const canApply = useMemo(
    () => establishment.status !== 'active' && allowedActions.includes('establishment.update') && !openApplication,
    [allowedActions, establishment.status, openApplication]
  );
  const allowedLinks = useMemo(
    () => links
      .filter(link => allowedActions.includes(link.permissions))
      .filter(link => !link.conditions || link.conditions(establishment))
      .filter(link => !link.featureFlag || hasFeatureFlag(link.featureFlag)),
    [links, establishment, hasFeatureFlag]
  );

  return (
    <Fragment>
      <LicenceStatusBanner licence={establishment} licenceType="pel" />
      <EnforcementFlags model={establishment} />

      <DocumentHeader
        title={<Snippet>dashboard.title</Snippet>}
        subtitle={establishment.name}
      />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <PanelList panels={
            allowedLinks.map((link, index) =>
              <DashboardLink key={index} { ...link } />
            )} />
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

            <dt><Snippet>establishmentCorporateStatus</Snippet></dt>
            <dd>{ (establishment.corporateStatus && <Snippet>{`corporateStatus.${establishment.corporateStatus}`}</Snippet>) || '-' }</dd>

            {
              establishment.pelh && <ProfileLink type="pelh" profile={establishment.pelh} />
            }
            {
              establishment.nprc && <ProfileLink type="nprc" profile={establishment.nprc} />
            }

            {
              !!holcs.length &&
                <Fragment>
                  <dt><Snippet>holc</Snippet></dt>
                  <dd>
                    {
                      holcs.map(holc => (
                        <p key={holc.id} className="holc">
                          <Link page="profile.read" profileId={holc.profile.id} label={`${holc.profile.firstName} ${holc.profile.lastName}`} />
                        </p>
                      ))
                    }
                  </dd>
                </Fragment>
            }

            {
              allowedActions.includes('establishment.sharedKey') && establishment.sharedKey &&
                <Fragment>
                  <dt><Snippet>sharedKey</Snippet></dt>
                  <dd>{establishment.sharedKey}</dd>
                </Fragment>
            }
            {
              asruUser && (
                <Fragment>
                  <dt><Snippet>cjsm</Snippet></dt>
                  <dd>{establishment.cjsmEmail || 'None'}</dd>
                  <Link page="establishment.cjsm" label="Edit" />
                </Fragment>
              )
            }
          </dl>
        </Sidebar>
      </div>
    </Fragment>
  );
}
