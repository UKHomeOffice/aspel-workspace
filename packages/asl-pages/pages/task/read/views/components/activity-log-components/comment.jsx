import { Inset, Markdown } from '@ukhomeoffice/asl-components';
import React from 'react';

export function Comment({ changedBy, comment }) {
  return (
    comment && (
      <div className="comment">
        {changedBy.id && (
          <p className="author">{`${changedBy.firstName} ${changedBy.lastName} commented:`}</p>
        )}
        <Inset>
          <div className="content">
            <Markdown>{comment}</Markdown>
          </div>
        </Inset>
      </div>
    )
  );
}
