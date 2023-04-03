import React from 'react';

const PanelList = ({ panels }) => (
    <ul className="panel-list">
        {
            panels.map((panel, index) =>
                <li key={index}>{ panel }</li>
            )
        }
    </ul>
);

export default PanelList;
