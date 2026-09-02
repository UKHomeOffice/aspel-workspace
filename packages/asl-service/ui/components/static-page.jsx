import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Renders the markdown-authored static pages (accessibility statement, privacy
 * notice, cookie policy).
 *
 * Markdown emits bare heading elements, which GOV.UK Frontend leaves unstyled —
 * so headings are mapped onto the type scale here rather than repeated in each
 * page's source.
 *
 * @see https://design-system.service.gov.uk/styles/type-scale/
 */
const components = {
  h1: props => <h1 className="govuk-heading-xl" {...props} />,
  h2: props => <h2 className="govuk-heading-l" {...props} />,
  h3: props => <h3 className="govuk-heading-m" {...props} />,
  h4: props => <h4 className="govuk-heading-s" {...props} />,
  p: props => <p className="govuk-body" {...props} />,
  ul: props => <ul className="govuk-list govuk-list--bullet" {...props} />,
  ol: props => <ol className="govuk-list govuk-list--number" {...props} />,
  a: props => <a className="govuk-link" {...props} />
};

export default function StaticPage({ children }) {
  return <ReactMarkdown components={components}>{ children }</ReactMarkdown>;
}
