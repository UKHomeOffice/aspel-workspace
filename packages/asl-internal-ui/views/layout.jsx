const React = require('react');
const GovUK = require('govuk-react-components/components/layout');
const PhaseBanner = require('govuk-react-components/components/phase-banner');

const Api = require('./components/api');

class Layout extends React.Component {
  render() {
    return (
      <GovUK propositionHeader={this.props.propositionHeader} title={this.props.title} stylesheets={['/public/css/app.css']}>
        <main className="main" id="content">
          <PhaseBanner phase="prototype" />
          <div className="grid-row">

            <div className="column-full">
              { this.props.children }
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