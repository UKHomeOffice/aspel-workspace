import React from 'react';
import PropTypes from 'prop-types';
import PhaseBanner from './phase-banner';

function HomeOffice({
  children,
  propositionHeader,
  title,
  assetPath = '/govuk',
  hoAssetPath = '/ho',
  stylesheets = [],
  scripts = [],
  homepageUrl = '/',
  logoLinkTitle = '',
  globalHeaderText = 'GOV.UK',
  propositionHeaderLink = '/',
  skipToContent = 'Skip to main content',
  skipToContentTarget = '#content',
  footerLinks = [],
  contactUsLink = false,
  headerContent,
  phaseBanner
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title || propositionHeader}</title>
        {stylesheets.map(file => (
          <link rel="stylesheet" media="screen" href={file} key={file} />
        ))}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content={`${assetPath}/images/opengraph-image.png?0.23.0`} />
      </head>
      <body>
        <header role="banner" className={propositionHeader ? 'with-proposition' : ''}>
          <a href={skipToContentTarget} className="govuk-skip-link">{skipToContent}</a>
          <div className="font-ui wrapper-header">
            <div className="header-logo">
              <a href={homepageUrl} title={logoLinkTitle} id="logo" className="content">
                <img src={`${hoAssetPath}/images/ho-logo.svg`} alt="Home Office logo" />
              </a>
            </div>
            {
              propositionHeader && (
                <div className="header-title">
                  {
                    propositionHeaderLink
                      ? <a href={propositionHeaderLink} id="header-name">{propositionHeader}</a>
                      : propositionHeader
                  }
                </div>
              )
            }
            {headerContent}
          </div>
        </header>

        {phaseBanner && <PhaseBanner {...phaseBanner} />}
        {children}

        <footer role="contentinfo">
          <div className="wrapper-footer">
            {footerLinks.length > 0 && (
              <div className="footer-menu">
                {footerLinks.map(section => (
                  <section key={section.sectionName}>
                    <h3>{section.sectionName}</h3>
                    {section.links.length > 0 && (
                      <ul>
                        {section.links.map(link => (
                          <li key={link.href}><a href={link.href}>{link.label}</a></li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            )}

            <ul className="default-links">
              <li><a href="http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/copyright-and-re-use/crown-copyright/">© Crown copyright</a></li>
              <li><a href="/privacy">Privacy notice</a></li>
              <li><a href="/cookies">Cookie policy</a></li>
              <li><a href="/accessibility">Accessibility statement</a></li>
              {contactUsLink && <li><a href="/contact-us">Contact us</a></li>}
            </ul>
          </div>
        </footer>

        <div id="global-app-error" className="app-error hidden"></div>
        {scripts.map(file => <script src={file} key={file}></script>)}
      </body>
    </html>
  );
}

HomeOffice.propTypes = {
  children: PropTypes.node,
  propositionHeader: PropTypes.string,
  title: PropTypes.string,
  assetPath: PropTypes.string,
  hoAssetPath: PropTypes.string,
  stylesheets: PropTypes.arrayOf(PropTypes.string),
  scripts: PropTypes.arrayOf(PropTypes.string),
  homepageUrl: PropTypes.string,
  logoLinkTitle: PropTypes.string,
  globalHeaderText: PropTypes.string,
  propositionHeaderLink: PropTypes.string,
  skipToContent: PropTypes.string,
  skipToContentTarget: PropTypes.string,
  footerLinks: PropTypes.arrayOf(
    PropTypes.shape({
      sectionName: PropTypes.string,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string,
          label: PropTypes.string
        })
      )
    })
  ),
  contactUsLink: PropTypes.bool,
  headerContent: PropTypes.node,
  phaseBanner: PropTypes.object
};

export default HomeOffice;
