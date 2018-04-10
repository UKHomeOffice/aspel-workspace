const React = require('react');
const connect = require('../src/helpers/connector');
const App = require('./layouts/app');

const moment = require('moment');

class Index extends React.Component {
  render() {
    return (
      <App {...this.props}>
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
          <dd><a href={`/profile/${this.props.establishment.licenceHolder.profile.id}`}>{ this.props.establishment.licenceHolder.profile.name }</a></dd>
        </dl>

        <div className="grid-row">

          <div className="column-one-half">
            <div className="data">
              <a href="/roles">
                <span className="data-item bold-xxlarge">{this.props.establishment.roles.length}</span>
                <span className="data-item bold-small">Named people</span>
              </a>
            </div>
          </div>

          <div className="column-one-half">
            <div className="data">
              <a href="/places">
                <span className="data-item bold-xxlarge">{this.props.establishment.places.length}</span>
                <span className="data-item bold-small">Locations</span>
              </a>
            </div>
          </div>
        </div>
      </App>
    );
  }
}

module.exports = connect(Index);
