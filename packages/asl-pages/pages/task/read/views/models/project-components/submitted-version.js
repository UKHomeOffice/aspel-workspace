import React, { Fragment } from 'react';
import { StickyNavAnchor, Snippet, Link, Utils } from '@ukhomeoffice/asl-components';
import EstablishmentLinks from '../../components/establishment-links';
import PplDeclarations from '../../components/ppl-declarations';

const SubmittedVersion = ({
  task,
  additionalEstablishments,
  isAsru,
  isDiscarded,
  version,
  project,
  establishment,
  dateFormat
}) => (
  <StickyNavAnchor id="submitted-version" key="submitted-version">
    <h2><Snippet>sticky-nav.submitted-version</Snippet></h2>
    {task.status === 'with-inspectorate' && <PplDeclarations task={task} />}
    <div className="gutter">
      {!!additionalEstablishments.length && (
        <Fragment>
          <h3><Snippet>additional-establishments.title</Snippet></h3>
          <EstablishmentLinks establishments={additionalEstablishments} showLink={isAsru} />
        </Fragment>
      )}
      {isDiscarded
        ? <p><Snippet date={Utils.formatDate(version.deleted, dateFormat.long)}>versions.submitted.discarded</Snippet></p>
        : (
          <Fragment>
            <p><Snippet>versions.submitted.text</Snippet></p>
            <Link
              page="projectVersion.fullApplication"
              className="govuk-button button-secondary"
              versionId={version.id}
              establishmentId={project.establishmentId}
              projectId={project.id}
              label={<Snippet>versions.submitted.label</Snippet>}
            />
          </Fragment>
        )}
    </div>
  </StickyNavAnchor>
);

export default SubmittedVersion;
