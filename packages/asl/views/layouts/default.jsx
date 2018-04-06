const React = require('react');
const GovUK = require('govuk-react-components/components/layout');
const PhaseBanner = require('govuk-react-components/components/phase-banner');

const Breadcrumbs = require('../components/breadcrumbs');

const ScreenOnly = require('../helpers/screen-only');
const Pdf = require('./pdf');

const Layout = ({
  children,
  propositionHeader,
  title,
  scripts,
  crumbs,
  data
}) => (
  <GovUK
    propositionHeader={propositionHeader}
    title={title}
    stylesheets={['/public/css/app.css']}
    scripts={scripts}
  >
    <main className="main" id="content">
      <PhaseBanner phase="prototype" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="grid-row">
        <div className="column-full">
          <div id="page-component">
            { children }
          </div>
        </div>
        <script dangerouslySetInnerHTML={{__html: `window.INITIAL_STATE=${JSON.stringify(data)}`}} />
      </div>
    </main>
  </GovUK>
);

module.exports = ScreenOnly(Layout, Pdf);
