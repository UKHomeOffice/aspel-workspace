import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, Snippet } from '@asl/components';
import { formatDate } from '../../../../../lib/utils';
import { dateFormat } from '../../../../../constants';
import Subsection from './subsection';

export default function Details() {
  const project = useSelector(state => state.model);
  const { allowedActions } = useSelector(state => state.static);
  const isGranted = !!project.granted;
  const isRevoked = project.status === 'revoked';
  const snippetPath = `details.${isGranted ? 'granted' : 'application'}`;
  const latestVersion = project.versions[0];

  return (
    <Subsection title={<Snippet>{`${snippetPath}.title`}</Snippet>} className="licence-details">
      <dl className="inline">
        <dt><Snippet>{`${snippetPath}.licenceHolder`}</Snippet></dt>
        <dd>
          <Link page="profile.read" profileId={project.licenceHolder.id} label={`${project.licenceHolder.firstName} ${project.licenceHolder.lastName}`} />
        </dd>

        <dt><Snippet>fields.establishment.label</Snippet></dt>
        <dd>{project.establishment.name}</dd>

        {
          project.additionalEstablishments.length > 0 &&
            <Fragment>
              <dt><Snippet>fields.additionalEstablishments.label</Snippet></dt>
              <dd>{project.additionalEstablishments.map(e => e.name).join(', ')}</dd>
            </Fragment>
        }

        {
          isGranted && (
            <Fragment>
              <dt><Snippet>fields.licenceNumber.label</Snippet></dt>
              <dd>
                {project.licenceNumber ? project.licenceNumber : '-'}
                {
                  project.isLegacyStub && allowedActions.includes('project.updateLicenceNumber') &&
                  <Fragment>
                    <br />
                    <Link page="projectAsruActions.updateLicenceNumber" label="Change" />
                  </Fragment>
                }
              </dd>
              {
                project.amendedDate &&
                <Fragment>
                  <dt><Snippet>fields.amendedDate.label</Snippet></dt>
                  <dd>{formatDate(project.amendedDate, dateFormat.long)}</dd>
                </Fragment>
              }
              {
                !isRevoked &&
                <Fragment>
                  <dt><Snippet>fields.expiryDate.label</Snippet></dt>
                  <dd>{formatDate(project.expiryDate, dateFormat.long)}</dd>
                </Fragment>
              }
              {
                isRevoked &&
                <Fragment>
                  <dt><Snippet>fields.revocationDate.label</Snippet></dt>
                  <dd>{formatDate(project.revocationDate, dateFormat.long)}</dd>
                </Fragment>
              }
              {
                project.raDate &&
                <Fragment>
                  <dt><Snippet>fields.raDate.label</Snippet></dt>
                  <dd>{formatDate(project.raDate, dateFormat.long)}</dd>
                </Fragment>
              }
              {
                project.transferredInDate && (
                  <Fragment>
                    <dt><Snippet>fields.transferredInDate.label</Snippet></dt>
                    <dd>{formatDate(project.transferredInDate, dateFormat.long)}</dd>
                  </Fragment>
                )
              }
              {
                project.transferredOutDate && (
                  <Fragment>
                    <dt><Snippet>fields.transferredOutDate.label</Snippet></dt>
                    <dd>{formatDate(project.transferredOutDate, dateFormat.long)}</dd>
                  </Fragment>
                )
              }

            </Fragment>
          )
        }

        {
          !isGranted && (
            <Fragment>
              <dt><Snippet>fields.createdAt.label</Snippet></dt>
              <dd>{formatDate(project.createdAt, dateFormat.long)}</dd>

              <dt><Snippet>fields.updatedAt.label</Snippet></dt>
              <dd>{formatDate(latestVersion.updatedAt, dateFormat.long)}</dd>
            </Fragment>
          )
        }
      </dl>
    </Subsection>
  );
}
