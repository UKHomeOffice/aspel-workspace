import React from 'react';

/**
 * SupportingLinks component renders a section with a title and a list of links.
 *
 * @param {Object} props - The component props.
 * @param {string} props.sectionTitle - The title of the section.
 * @param {Array} props.links - An array of link objects.
 * @param {string} props.links[].href - The URL of the link.
 * @param {string} props.links[].label - The label of the link.
 *
 * @returns {JSX.Element} The rendered SupportingLinks component.
 */
const SupportingLinks = ({ sectionTitle, links }) => (
    <div className="govuk-grid-column-one-third">
        <div className="x-govuk-related-navigation">
            <nav className="x-govuk-related-navigation__nav-section" role="navigation" aria-labelledby="related-navigation-related-content">
                <h2 className="x-govuk-related-navigation__main-heading" id="related-navigation-related-content">{sectionTitle}</h2>

                <ul className="x-govuk-related-navigation__link-list">
                    {links.map(link => (
                        <li className="x-govuk-related-navigation__link" key={link.href}>
                            <a className="govuk-link x-govuk-related-navigation__section-link x-govuk-related-navigation__section-link--other" href={link.href}>{link.label}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </div>
);

export default SupportingLinks;
