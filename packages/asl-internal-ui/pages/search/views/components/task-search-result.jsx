import React, { Fragment } from 'react';
import get from 'lodash/get';
import { Inset, Markdown } from '@asl/components';

function getHighlight(row, propName) {
  return get(row, `highlight['${propName}'][0]`);
}

export default function TaskSearchResult({ model }) {
  const titleMatch = getHighlight(model, 'projectTitle');
  const licenceMatch = getHighlight(model, 'licenceNumber');

  if (!titleMatch && !licenceMatch) {
    return null;
  }

  return (
    <Inset>
      { titleMatch &&
        <Fragment>
          <h3>Project</h3>
          <Markdown>{titleMatch}</Markdown>
        </Fragment>
      }

      { licenceMatch &&
        <Fragment>
          <h3>Licence number</h3>
          <Markdown>{licenceMatch}</Markdown>
        </Fragment>
      }
    </Inset>
  );
}
