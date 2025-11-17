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

      <div>
        <p>
          <a href={`/attachment/${version.hbaToken}`} download={version.hbaFilename}>
            <Snippet>otherDocuments.links.hba</Snippet>
          </a>
        </p>
        <p>
          {canReplaceHBA && (
            <Link
              page="project.replaceHba"
              project={project}
              label={<Snippet>otherDocuments.links.replaceHba</Snippet>}
            />
          )}
        </p>
      </div>

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
