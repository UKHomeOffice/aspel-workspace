import React from 'react';
import { StickyNavAnchor, Snippet } from '@ukhomeoffice/asl-components';

const ReopenTask = ({ canReopenTask, url, onFormSubmit, onReopen }) => (
  <StickyNavAnchor id="reopen" key="reopen">
    <h2><Snippet>sticky-nav.reopen</Snippet></h2>
    <p><Snippet>reopen.content</Snippet></p>
    <form action={`${url}/reopen`} method="POST" onSubmit={onFormSubmit} className="gutter">
      <button className="govuk-button button-secondary" onClick={onReopen}>
        <Snippet>reopen.button</Snippet>
      </button>
    </form>
  </StickyNavAnchor>
);

export default ReopenTask;
