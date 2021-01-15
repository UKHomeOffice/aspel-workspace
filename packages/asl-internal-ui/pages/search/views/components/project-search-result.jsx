import React, { Fragment } from 'react';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import {
  Link,
  Markdown,
  Snippet,
  Inset
} from '@asl/components';

const Highlight = ({ project, highlight, field }) => {
  const section = field.split('.')[1];
  let protocol = {};
  if (section === 'protocols') {
    const protocolIndex = field.split('.')[2];
    protocol = project.protocols[protocolIndex] || {};
  }
  return <Fragment>
    <h4><Snippet protocol={protocol.title}>{`sections.${section}`}</Snippet></h4>
    <Inset className="search-highlight">
      <Markdown>{ `...${highlight[0].trim()}...` }</Markdown>
    </Inset>
  </Fragment>;
};

const ProjectSearchResult = ({ project }) => {
  const searchTerm = useSelector(state => get(state, `datatable.filters.active['*'][0]`));
  const highlights = Object.keys(project.highlight || {});
  const hasMore = highlights.length > 1;

  return (
    <Fragment>
      <h3>
        <Link
          page="projectVersion.fullApplication"
          establishmentId={project.establishment.id}
          projectId={project.id}
          versionId={project.versionId}
          label={project.title || 'Untitled project'}
        />
      </h3>

      {
        highlights.slice(0, 1).map((key, i) => {
          return <Highlight project={project} highlight={project.highlight[key]} field={key} key={key} />;
        })
      }
      {
        hasMore && (
          <details>
            <summary>{`Show ${highlights.length - 1} more section${highlights.length > 2 ? 's' : ''} containing '${searchTerm}'` }</summary>
            {
              highlights.slice(1).map((key, i) => {
                return <Highlight project={project} highlight={project.highlight[key]} field={key} key={key} />;
              })
            }
          </details>
        )
      }
    </Fragment>
  );
};

export default ProjectSearchResult;
