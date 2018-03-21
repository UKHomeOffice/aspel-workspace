const React = require('react');
const GovUK = require('govuk-react-components/components/layout');
const PhaseBanner = require('govuk-react-components/components/phase-banner');

const Pdf = require('./pdf');
const Api = require('../components/api');
const Breadcrumb = require('../components/breadcrumb');

const {pick} = require('lodash');

class Layout extends React.Component {
  render() {
    if (this.props.pdf) {
      return <Pdf {...this.props}>{ this.props.children }</Pdf>
    }
    return (
      <GovUK
        propositionHeader={this.props.propositionHeader}
        title={this.props.title}
        stylesheets={['/public/css/app.css']}
        scripts={this.props.scripts}
        >
        <main className="main" id="content">
          <PhaseBanner phase="prototype" />
          <Breadcrumb crumbs={this.props.crumbs} />
          <div className="grid-row">

            <div className="column-full">
              <div id="page-component">
                { this.props.children }
              </div>
              <p><a className="button button-large" href="?pdf=1">Download as PDF</a></p>
              <p><a className="button button-large" href="/logout">Log out</a></p>
            </div>
            <script dangerouslySetInnerHTML={{__html: `window.INITIAL_STATE=${JSON.stringify(pick(this.props, this.props.exposes))}`}} />
          </div>
        </main>
      </GovUK>
    );
  }
}

module.exports = Layout;