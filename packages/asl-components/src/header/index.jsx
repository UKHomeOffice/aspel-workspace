import React from 'react';

const Header = ({
  title,
  subtitle
}) => (
  <header className="page-header">
    {
      subtitle && <h2>{subtitle}</h2>
    }
    {
      title && <h1>{title}</h1>
    }
  </header>
);

export default Header;
