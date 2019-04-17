import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, StickyNavPage, StickyNavAnchor, Snippet, Form } from '@asl/components';
import WithdrawApplication from './withdraw-application';

const declarationAnswer = val => val === 'yes' ? 'Yes' : 'Not yet';

const Project = ({ task, project, establishment, children, schema }) => {
  const submitted = project.versions.find(v => v.status === 'submitted');
  const taskMeta = task.data.meta;

  return (
    <StickyNavPage>
      { children }
      <StickyNavAnchor id="submitted-version">
        <h2><Snippet>sticky-nav.submitted-version</Snippet></h2>
        <p><Snippet>versions.submitted.hint</Snippet></p>
        <p>
          <Link
            page="project.version.read"
            className="govuk-button button-secondary"
            versionId={submitted.id}
            establishmentId={establishment.id}
            projectId={project.id}
            label={<Snippet>versions.submitted.label</Snippet>}
          />
        </p>

        {
          task.status === 'with-inspectorate' &&
            <Fragment>
              <p><Snippet>declarations.pel-holder</Snippet></p>
              <p><strong>{declarationAnswer(taskMeta.authority)}</strong></p>

              <p><Snippet>declarations.awerb</Snippet></p>
              <p><strong>{declarationAnswer(taskMeta.awerb)}</strong></p>

              <p><Snippet>declarations.ready-for-inspector</Snippet></p>
              <p><strong>{declarationAnswer(taskMeta.ready)}</strong></p>
            </Fragment>
        }
      </StickyNavAnchor>

      {
        schema.status.options.length > 0 &&
          <StickyNavAnchor id="status">
            <h2><Snippet>sticky-nav.status</Snippet></h2>
            <p><Snippet>make-decision.hint</Snippet></p>
            <Form />
            { task.canBeWithdrawn && <WithdrawApplication showHeading /> }
          </StickyNavAnchor>
      }

      {
        schema.status.options.length === 0 && task.canBeWithdrawn &&
          <StickyNavAnchor id="withdraw">
            <h2><Snippet>sticky-nav.withdraw</Snippet></h2>
            <WithdrawApplication />
          </StickyNavAnchor>
      }

    </StickyNavPage>
  );
};

const mapStateToProps = ({ static: { project, establishment, schema } }) => ({ project, establishment, schema });

export default connect(mapStateToProps)(Project);
