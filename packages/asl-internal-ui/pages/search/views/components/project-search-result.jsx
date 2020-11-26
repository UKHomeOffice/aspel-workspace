import React, { Fragment, useState } from 'react';
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
    const protocolId = field.split('.')[2];
    protocol = project.protocols.find(p => p.id === protocolId);
  }
  return <Fragment>
    <h4><Snippet protocol={protocol.title}>{`sections.${section}`}</Snippet></h4>
    <Inset className="search-highlight">
      <Markdown>{ `...${highlight[0].trim()}...` }</Markdown>
    </Inset>
  </Fragment>;
};

const ProjectSearchResult = ({ project }) => {
  const [expanded, setExpanded] = useState(false);
  const highlights = Object.keys(project.highlight || {});
  const hasMore = highlights.length > 1;

  const toggle = (e) => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  return (
    <Fragment>
      <h3>
        <Link
          page="projectVersion"
          establishmentId={project.establishment.id}
          projectId={project.id}
          versionId={project.versionId}
          label={project.title || 'Untitled project'}
        />
      </h3>

      {
        highlights.map((key, i) => {
          if (i > 0 && !expanded) {
            return null;
          }
          const highlight = project.highlight[key];
          return <Highlight project={project} highlight={highlight} field={key} key={key} />;
        })
      }
      {
        hasMore && (
          <p><a href="#" onClick={toggle}>{ expanded ? 'Show fewer matches in this project' : `Show ${highlights.length - 1} more matches in this project` }</a></p>
        )
      }
    </Fragment>
  );
};

export default ProjectSearchResult;
