import React from 'react';
import { Sidebar } from '../';

const WidthContainer = ({ children, sidebar, sidebarLeft = false }) => (
  <div className="govuk-grid-row">
    {
      sidebar && sidebarLeft && <Sidebar>{ sidebar }</Sidebar>
    }
    <div className="govuk-grid-column-two-thirds">
      { children }
    </div>
    {
      sidebar && !sidebarLeft && <Sidebar>{ sidebar }</Sidebar>
    }
  </div>
);

export default WidthContainer;
