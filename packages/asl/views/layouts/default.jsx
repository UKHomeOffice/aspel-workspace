const React = require('react');
const GovUK = require('govuk-react-components/components/layout');
const PhaseBanner = require('govuk-react-components/components/phase-banner');

const Pdf = require('./pdf');
const Api = require('../components/api');
const Breadcrumb = require('../components/breadcrumb');

class Layout extends React.Component {
  render() {
    if (this.props.pdf) {
      return <Pdf {...this.props}>{ this.props.children }</Pdf>
    }
    return (
      <GovUK propositionHeader={this.props.propositionHeader} title={this.props.title} stylesheets={['/public/css/app.css']}>
        <main className="main" id="content">
          <PhaseBanner phase="prototype" />
          <Breadcrumb crumbs={this.props.crumbs} />
          <div className="grid-row">

            <div className="column-full">
              { this.props.children }
              <p><a className="button button-large" href="?pdf=1">Download as PDF</a></p>
              <Api {...this.props.api} />
              <p><a className="button button-large" href="/logout">Log out</a></p>
            </div>

          </div>
        </main>
      </GovUK>
    );
  }
}

module.exports = Layout;