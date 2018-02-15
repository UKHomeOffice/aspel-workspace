const React = require('react');
const Layout = require('./layout');
const Api = require('./components/api');

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        {
          this.props.establishment ? (
            <div>
              <h1 className="heading-xlarge">{this.props.establishment.name}</h1>

              <div class="grid-row">

                <div class="column-one-half">
                  <div class="data">
                    <a href="/roles">
                      <span class="data-item bold-xxlarge">{this.props.establishment.roles.length}</span>
                      <span class="data-item bold-small">Named people</span>
                    </a>
                  </div>
                </div>

                <div class="column-one-half">
                  <div class="data">
                    <a href="/places">
                      <span class="data-item bold-xxlarge">{this.props.establishment.places.length}</span>
                      <span class="data-item bold-small">Locations</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : <p>No associated establishment</p>
        }
      </Layout>
    );
  }
}

module.exports = Index;