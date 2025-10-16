import React from 'react';
import { Link, Snippet } from '@ukhomeoffice/asl-components';
import {format as formatDate} from 'date-fns';
import { dateFormat } from '@asl/pages/constants';

const HBA = ({ version, project, canReplaceHBA, hbaHeading }) => {
  if (!version?.hbaToken) {
    return null;
  }

  return (
    <div>
      {hbaHeading && (
        <h3>
          <Snippet>downloads.hba.heading</Snippet>
        </h3>
      )}

      <p>
        <a href={`/attachment/${version.hbaToken}`} download={version.hbaFilename}>
          <Snippet>otherDocuments.links.hba</Snippet>
        </a>

        {canReplaceHBA && (
          <Link
            page="project.replaceHba"
            project={project}
            className="govuk-!-padding-left-3"
            label={<Snippet>otherDocuments.links.replaceHba</Snippet>}
          />
        )}
      </p>

      {version.hbaReplaced && (
        <div className="govuk-hint">
          <strong>Replaced</strong>  {formatDate(version.updatedAt, dateFormat.datetime)}
        </div>
      )
      }
    </div>
  )
  ;
};

export default HBA;
