import React, { Fragment } from 'react';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import {
  Link,
  Markdown,
  Snippet,
  Inset,
  ExpiryDate
} from '@asl/components';

const Highlight = ({ project, highlight, field }) => {
  const section = field.split('.')[1];
  let protocol = {};
  if (section === 'protocols') {
    const protocolIndex = field.split('.')[2];
    protocol = project.protocols[protocolIndex] || {};
  }

  return <Fragment>
    <Inset className="search-highlight">
      <h4>
        <Link
          page="projectVersion.fullApplication"
          establishmentId={project.establishment.id}
          projectId={project.id}
          versionId={project.versionId}
          suffix={`/${section}`}
          label={<Snippet protocol={protocol.title}>{`sections.${section}`}</Snippet>}
        />
      </h4>
      <Markdown>{ highlight[0].trim() }</Markdown>
    </Inset>
  </Fragment>;
};

const EndDate = ({ project }) => {
  const fields = {
    expired: 'expiryDate',
    active: 'expiryDate',
    revoked: 'revocationDate'
  };

  const field = fields[project.status];
  if (!field) {
    return null;
  }

  return <dl>
    <dt><Snippet>{ `fields.${field}.label` }</Snippet>:</dt>
    <dd>
      <ExpiryDate date={project[field]} showNotice={false} />
    </dd>
  </dl>;
};

const ProjectSearchResult = ({ project }) => {
  const searchTerm = useSelector(state => get(state, `datatable.filters.active['*'][0]`));

  const highlights = Object.keys(project.highlight || {}).filter(h => h !== 'title');
  const hasMore = highlights.length > 1;

  let title = project.title || 'Untitled project'
  if (project.highlight.title && project.highlight.title[0]) {
    title = <Markdown>{ project.highlight.title[0] }</Markdown>;
  }

  return (
    <div className="project-search-result">
      <h2>
        <Link
          page="projectVersion.fullApplication"
          establishmentId={project.establishment.id}
          projectId={project.id}
          versionId={project.versionId}
          label={title}
        />
      </h2>
      <div className="metadata">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <dl>
              <dt><Snippet>fields.licenceHolder.label</Snippet>:</dt>
              <dd>{ `${project.licenceHolder.firstName} ${project.licenceHolder.lastName}` }</dd>
            </dl>
          </div>
          <div className="govuk-grid-column-one-half">
            <dl>
              <dt><Snippet>fields.status.label</Snippet>:</dt>
              <dd><Snippet>{`status.${project.status}`}</Snippet></dd>
            </dl>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <dl>
              <dt><Snippet>fields.establishment.label</Snippet>:</dt>
              <dd>{ project.establishment.name }</dd>
            </dl>
          </div>
          <div className="govuk-grid-column-one-half">
            <EndDate project={project} />
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default ProjectSearchResult;
