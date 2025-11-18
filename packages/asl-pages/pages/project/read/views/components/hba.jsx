import React from 'react';
import { Link, Snippet, Inset } from '@ukhomeoffice/asl-components';
import {format as formatDate} from 'date-fns';
import { dateFormat } from '@asl/pages/constants';

const HBA = ({ version, project, canReplaceHBA }) => {
  if (!version?.hbaToken) {
    return null;
  }

  return (
    <div>
      <h3>
        <Snippet>downloads.hba.heading</Snippet>
      </h3>

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

      {Array.isArray(version.hbaReplaced) && version.hbaReplaced.length > 0 && (
        <div className="govuk-hint">
          {(() => {
            const latest = version.hbaReplaced.at(-1);

            return (
              <details>
                <summary>HBA file replaced – view details</summary>

                <Inset>
                  <div className="govuk-!-margin-bottom-2" style={{ display: 'flex' }}>
                    <strong style={{ width: '120px' }}>Date</strong>
                    <span>
                      {latest.uploadedAt
                        ? formatDate(new Date(latest.uploadedAt), dateFormat.medium)
                        : '-'}
                    </span>
                  </div>

                  <div className="govuk-!-margin-bottom-2" style={{ display: 'flex' }}>
                    <strong style={{ width: '120px' }}>By</strong>
                    <span>{latest.asruUser || '-'}</span>
                  </div>

                  <div style={{ display: 'flex' }}>
                    <strong style={{ width: '120px' }}>Reason</strong>
                    <span>{latest.hbaReplacementReason || '-'}</span>
                  </div>
                </Inset>

              </details>
            );
          })()}
        </div>
      )}

    </div>
  )
  ;
};

export default HBA;
