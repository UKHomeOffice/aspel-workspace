import React from 'react';
import { useSelector } from 'react-redux';


export default function RaSidePanel() {
  const sidebarLinks = useSelector(state => state.application.sidebarLinks);
  return (
    <nav className="ra-nav">
      <h3>Project links</h3>
      <p className="govuk-hint">Links will open in a new tab</p>
      <ul>
        <li><a href={sidebarLinks.nts} target="_blank" rel="noopener noreferrer">Non technical summary</a></li>
        <li><a href={sidebarLinks.granted} target="_blank" rel="noopener noreferrer">Expired licence</a></li>
        <li><a href={sidebarLinks.adverse}>Steps and adverse effects</a></li>
        <li><a href={sidebarLinks.protocols} target="_blank" rel="noopener noreferrer">Protocol summary table</a></li>
      </ul>
    </nav>
  )
}
