import React from 'react';
import { useSelector } from 'react-redux';
import {
  Header,
  Form,
  WidthContainer,
  ErrorSummary,
  Link,
  Snippet
} from '@ukhomeoffice/asl-components';

const UploadView = () => {
  const { project } = useSelector(state => state.static);

  return (
    <WidthContainer>
      <ErrorSummary />
      <Form
        cancelLink={
          <Link page="project.read" label="Cancel" establishmentId={project.establishmentId} projectId={project.id} />
        }>

        <Header title={<Snippet>breadcrumbs.project.replaceHba</Snippet>} subtitle={project.title} />
        <p>
          <Snippet>replacementHbaParagraph</Snippet>
        </p>

        {project.granted?.hbaToken && (
          <>
            <h2>Current HBA file:</h2>
            <a
              href={`/attachment/${project.granted.hbaToken}`}
              download={project.granted.hbaFilename}
              style={{ display: 'block', marginTop: '5px' }}
            >
              {project.granted.hbaFilename}
            </a>
            <br />
          </>
        )}
      </Form>
    </WidthContainer>
  );
};

export default UploadView;
