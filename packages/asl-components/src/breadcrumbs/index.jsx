import React from 'react';
import { omit } from 'lodash';
import Link from '../link';
import Snippet from '../snippet';

export const Breadcrumb = ({ crumb = {}, link = false }) => {
    let props = null;

    if (typeof crumb === 'object' && crumb !== null) {
        props = omit(crumb, 'label');
        crumb = crumb.label;
    }

    const snippet =
      <Snippet {...props} fallback={`breadcrumbs.${crumb}.index`}>
          {`breadcrumbs.${crumb}`}
      </Snippet>;

    return (
        <li className="govuk-breadcrumbs__list-item"
            data-testid="breadcrumb"
            data-crumb={crumb}
            data-link={link}
        >
            {link ? <Link page={crumb} label={snippet} {...props} /> : snippet}
        </li>
    );
};

const renderNull = crumbs => !crumbs || !Array.isArray(crumbs) || crumbs.length < 2;

const Breadcrumbs = ({ crumbs }) => {
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
