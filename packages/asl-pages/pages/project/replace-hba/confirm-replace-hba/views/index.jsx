import React from 'react';
import { ErrorSummary, WidthContainer, Header, Form, Snippet } from '@ukhomeoffice/asl-components';
import { useSelector } from 'react-redux';
import { Warning } from '../../../../common/components/warning';

const Index = () => {
  const { project, hbaToken, hbaFilename } = useSelector(state => state.static);

  return (
    <WidthContainer>
      <ErrorSummary />
      <Header title={<Snippet>breadcrumbs.project.confirmReplaceHba</Snippet>} subtitle={project.title} />
      <Form>
        <p>
          <strong>
            <Snippet>fields.hbaFilename.label</Snippet>
          </strong>
          <br />
          <a href={`/attachment/${hbaToken}`} download={`${hbaFilename}`}>{hbaFilename}</a>{' '}
        </p>
        <Warning>
          <Snippet>warning.amendment</Snippet>
        </Warning>
      </Form>

    </WidthContainer>
  );
};
export default Index;
