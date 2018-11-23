import React from 'react';
import map from 'lodash/map';
import classnames from 'classnames';
import { Link, Snippet } from '../';

const Tabs = ({ tabs, activeTab }) => (
  <nav className="govuk-tabs">
    <ul>
      {
        map(tabs, (tab, key) => (
          <li className={classnames({ active: key === activeTab })}>
            <Link page={tab.page} label={<Snippet>{`tabs.${key}`}</Snippet>} />
          </li>
        ))
      }
    </ul>
  </nav>
);

export default Tabs;
