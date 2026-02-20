import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Link, StickyNavAnchor, Snippet, Utils } from '@ukhomeoffice/asl-components';

export default function ROP({ task }) {
  const { establishment, values } = useSelector(state => state.static, shallowEqual);

  return (
    <StickyNavAnchor id="latest-return" key="latest-return">
      <h2><Snippet>sticky-nav.latest-return</Snippet></h2>
      { task.status !== 'reopened' && <p><Snippet date={Utils.formatDate(task.createdAt, Utils.DATE_FORMAT.long)}>view-return.content</Snippet></p> }
      <p className="gutter">
        <Link
          className="govuk-button"
          page="rops.procedures"
          establishmentId={establishment.id}
          projectId={values.project.id}
          ropId={values.id}
          label={<Snippet>view-return.action</Snippet>}
        />
      </p>
    </StickyNavAnchor>
  );
}
