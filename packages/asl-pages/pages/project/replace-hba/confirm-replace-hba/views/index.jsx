import React from 'react';
import { ErrorSummary, WidthContainer, Header, Form, Snippet, Link } from '@ukhomeoffice/asl-components';
import { useSelector } from 'react-redux';
import { Warning } from '../../../../common/components/warning';

const Index = () => {
  const { project, hbaToken, hbaFilename } = useSelector(state => state.static);

  return (
    <WidthContainer>
      <ErrorSummary />
      <Header title={<Snippet>breadcrumbs.project.confirmReplaceHba</Snippet>} subtitle={project.title} />
      <Form
        cancelLink={
          <Link page="project.read" label="Cancel" establishmentId={project.establishmentId} projectId={project.id}
            query={{ clearForm: 1 }} />
        }>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-quarter">
            <strong>
              <Snippet>fields.hbaFilename.label</Snippet>
            </strong>
          </div>
          <div className="govuk-grid-column-two-thirds">
            <div>
              <a href={`/attachment/${hbaToken}`} download={hbaFilename}>
                {hbaFilename}
              </a>
            </div>
            <div style={{ marginTop: '0.5em' }}>
              <Link
                page="project.replaceHba"
                establishmentId={project.establishmentId}
                projectId={project.id}
                label={<Snippet>changeHba</Snippet>}
              />
            </div>
          </div>
        </div>
        <br />
        <Warning>
          <Snippet>warning</Snippet>
        </Warning>
      </Form>

    </WidthContainer>
  );
};
export default Index;
