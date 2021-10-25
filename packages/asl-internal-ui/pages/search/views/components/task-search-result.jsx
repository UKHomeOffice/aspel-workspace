import React from 'react';
import get from 'lodash/get';
import { Inset, Markdown } from '@asl/components';

export function hasProjectTitleMatch(row) {
  const highlight = get(row, `highlight['projectTitle'][0]`);
  return row.model === 'project' && highlight;
}

export default function TaskSearchResult({ model }) {
  const highlight = hasProjectTitleMatch(model);

  if (!highlight) {
    return null;
  }

  return (
    <Inset>
      <h3>Project</h3>
      <Markdown>{highlight}</Markdown>
    </Inset>
  );
}
