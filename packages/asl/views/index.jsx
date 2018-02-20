const React = require('react');
const Layout = require('./layout');
const Api = require('./components/api');

const moment = require('moment');

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        {
          this.props.establishment ? (
            <div>
              <h1 className="heading-xlarge">{this.props.establishment.name} </h1>

              <dl>
                <dt>Licence number</dt>
                <dd>{ this.props.establishment.licenceNumber } </dd>

                <dt>Address</dt>
                <dd>{ this.props.establishment.address }</dd>

                <dt>Email</dt>
                <dd>{ this.props.establishment.email }</dd>

                <dt>Status</dt>
                <dd>{ this.props.establishment.status }</dd>

                <dt>Issued at</dt>
                <dd>{ moment(this.props.establishment.issueDate).format('DD/MM/YYYY') }</dd>

                <dt>Licence holder</dt>
                <dd><a href={`/profile/${this.props.elh.profile.id}`}>{ this.props.elh.profile.name }</a></dd>
              </dl>


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