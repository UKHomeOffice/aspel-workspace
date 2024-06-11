import React from 'react';
import classnames from 'classnames';

const SectionItem = ({ section, index }) => (
    <li className={classnames('section-item', section.name)}><section.Component { ...section } index={index} /></li>
);

const SectionList = ({ sections }) => (
    <ul className="section-list">
        {
            sections.map((section, index) => <SectionItem key={index} section={section} index={index} />)
        }
    </ul>
);

export default SectionList;
