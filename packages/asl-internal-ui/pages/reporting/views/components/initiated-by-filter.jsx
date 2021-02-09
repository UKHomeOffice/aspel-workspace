import React from 'react';
import merge from 'lodash/merge';
import { Tabs, Link } from '@asl/components';

export default function InitiatedByFilter({ tabs, activeTab, page, query = {} }) {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <Tabs active={Object.keys(tabs).indexOf(activeTab)}>
          {
            Object.keys(tabs).map(key => (
              <Link key={key} page={page} query={merge({}, query, {initiatedBy: key})} label={tabs[key]} />
            ))
          }
        </Tabs>
      </div>
    </div>
  );
}
