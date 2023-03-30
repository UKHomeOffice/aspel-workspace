import React, { Fragment } from 'react';
import { LinkFilter } from '../';

export default function LinkFilterList({ filters }) {
  return (
    <div className="link-filter-list">
      {
        filters.map((filter, index) => (
          <Fragment key={index}>
            <div className="label">{ filter.label }</div>
            <LinkFilter
              {...filter}
              label={null}
            />
          </Fragment>
        ))
      }
    </div>
  );
}
