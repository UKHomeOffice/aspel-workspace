import React from 'react';
import get from 'lodash/get';
import { Inset, Markdown } from '@asl/components';

export function willRender(model) {
  const highlight = get(model, `highlight['projectTitle'][0]`);
  return model.model === 'project' && highlight;
}

export default function TaskSearchResult({ model }) {
  if (!willRender(model)) {
    return null;
  }

  const highlight = get(model, `highlight['projectTitle'][0]`);

  return (
    <Inset>
      <h3>Project</h3>
      {
        highlight
          ? <Markdown>{highlight}</Markdown>
          : <p>{model.projectTitle}</p>
      }
    </Inset>
  );
}
