import React from 'react';

const Header = ({
    title,
    subtitle
}) => (
    <header className="page-header">
        {
            subtitle && <span className="govuk-caption-l">{subtitle}</span>
        }
        {
            title && <h1>{title}</h1>
        }
    </header>
);

export default Header;
