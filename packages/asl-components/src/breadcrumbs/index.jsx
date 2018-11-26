import React from 'react';
import Link from '../link';
import Snippet from '../snippet';

export const Breadcrumb = ({
  crumb = {},
  link = false
}) => {
  return <li className="govuk-breadcrumbs__list-item">
  {
    link ?
      <Link page={crumb} label={<Snippet>{`breadcrumbs.${crumb}`}</Snippet>} /> :
      <Snippet>{`breadcrumbs.${crumb}`}</Snippet>
  }
  </li>;
};

const renderNull = crumbs => !crumbs || !crumbs.length || !Array.isArray(crumbs);

const Breadcrumbs = ({
  crumbs
}) => {
  if (renderNull(crumbs)) {
    return null;
  }
  return (
    <div className="govuk-breadcrumbs">
      <ol className="govuk-breadcrumbs__list">
        {
          crumbs.map((crumb, index) =>
            <Breadcrumb key={index} crumb={crumb} link={index !== crumbs.length - 1} />
          )
        }
      </ol>
    </div>
  );
};

export default Breadcrumbs;
