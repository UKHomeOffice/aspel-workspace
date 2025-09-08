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
  const { project, url } = useSelector(state => state.static);

  const handleFileChange = e => {
    console.log('File selected:', e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Submitting upload...');
  };

  return (
    <WidthContainer>
      <ErrorSummary />
      <Form
        onSubmit={handleSubmit}
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
          </>
        )}

        <div style={{ marginBottom: '20px' }}>
          <br />
          <h2 style={{ marginBottom: '10px' }}>Replacement HBA file</h2>
          <input
            id="fileUpload"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'block', marginBottom: '20px' }}
          />
        </div>
      </Form>
    </WidthContainer>
  );
};

export default UploadView;
