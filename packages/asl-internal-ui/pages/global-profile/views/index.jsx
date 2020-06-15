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
)

function AsruAssociations({ establishments }) {
  return (
    <ul className="panel-list">
      {
        establishments.map(establishment => {
          return (
            <li key={establishment.id}>
              <Link page="establishment.dashboard" establishmentId={establishment.id} label={establishment.name} />
            </li>
          );
        })
      }
    </ul>
  );
}

export default function InternalGlobalProfile() {
  const model = useSelector(state => state.model);
  return (
    <GlobalProfile dedupe={dedupe} AsruRolesComponent={AsruActions}>
      {
        model.asruInspector && model.asru && !!model.asru.length && <Fragment>
          <h3>Inspector for:</h3>
          <AsruAssociations establishments={model.asru} />
        </Fragment>
      }
      {
        model.asruLicensing && model.asru && !!model.asru.length && <Fragment>
          <h3>Single Point of Contact (SPoC) for:</h3>
          <AsruAssociations establishments={model.asru} />
        </Fragment>
      }
      <RelatedTasks />
    </GlobalProfile>
  )
}
