import get from 'lodash/get';
import { Inset, Markdown } from '@ukhomeoffice/asl-components';
import React from 'react';

export function DeclarationMeta({ item }) {
  const declaration = get(item, 'event.meta.payload.meta.declaration');

  if (!declaration) {
    return null;
  }

  return (
    <div className="declaration">
      <p>Declaration:</p>
      <Inset>
        <Markdown>{declaration}</Markdown>
      </Inset>
    </div>
  );
}
