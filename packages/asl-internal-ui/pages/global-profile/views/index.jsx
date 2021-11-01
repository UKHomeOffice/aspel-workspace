import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, Snippet } from '@asl/components';
import GlobalProfile from '@asl/pages/pages/global-profile/views/index';
import AsruActions from '../components/asru-actions';
import RelatedTasks from '@asl/pages/pages/task/list/views/related-tasks';

const dedupe = (
  <p className="float-right">
    <Link page="globalProfile.dedupe" className="govuk-button" label={<Snippet>dedupe</Snippet>} />
  </p>
);

export default function InternalGlobalProfile() {
  const model = useSelector(state => state.model);
  return (
    <GlobalProfile dedupe={dedupe} AsruRolesComponent={AsruActions}>
      {
        !model.asruUser && <Fragment>
          <h2>Personal licences</h2>
          <p><Link page="globalProfile.pils" profileId={model.id} label="View complete PIL history" /></p>
        </Fragment>
      }
      {
        model.asruUser && <RelatedTasks />
      }
    </GlobalProfile>
  );
}
