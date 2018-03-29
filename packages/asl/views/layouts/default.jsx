const React = require('react');
const { Provider } = require('react-redux');
const GovUK = require('govuk-react-components/components/layout');
const PhaseBanner = require('govuk-react-components/components/phase-banner');

const Pdf = require('./pdf');
const Api = require('../components/api');
const Breadcrumb = require('../components/breadcrumb');
const createStore = require('../../src/create-store');

const { pick } = require('lodash');

class Layout extends React.Component {
  constructor(options) {
    super(options);
    this.data = pick(this.props, this.props.exposes);
    this.store = createStore(this.data);
  }

  render() {
    if (this.props.pdf) {
      return <Pdf {...this.props}>{ this.props.children }</Pdf>
    }
    return (
      <Provider store={this.store}>
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
              </div>
              <script dangerouslySetInnerHTML={{__html: `window.INITIAL_STATE=${JSON.stringify(this.data)}`}} />
            </div>
          </main>
        </GovUK>
      </Provider>
    );
  }
}

module.exports = Layout;
