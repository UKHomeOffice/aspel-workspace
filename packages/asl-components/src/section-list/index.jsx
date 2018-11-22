import React from 'react';
import classnames from 'classnames';

const SectionItem = ({ section }) => (
  <li className={classnames('section-item', section.name)}><section.Component { ...section } /></li>
);

const SectionList = ({ sections }) => (
  <ul className="section-list">
    {
      sections.map((section, index) => <SectionItem key={index} section={section} />)
    }
  </ul>
);

export default SectionList;
