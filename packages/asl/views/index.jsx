const React = require('react');
const connect = require('../src/helpers/connector');
const App = require('./layouts/app');

const Index = ({
  store,
  establishment: {
    name,
    licenceNumber,
    licenceHolder: {
      profile: {
        id: elhId,
        name: elhName
      }
    }
  }
}) => (
  <App
    store={store}
    crumbs={[name]}
  >
    <header>
      <h2>&nbsp;</h2>
      <h1>{ name }</h1>
    </header>
    <div className="grid-row">
      <div className="column-two-thirds">
        <ul className="dashboard">
          <li><a href='/details'>Establishment details</a></li>
          <li><a href='/roles'>Named people and licence holders</a></li>
          <li><a href='/places'>Schedule of Premises</a></li>
        </ul>
      </div>
      <div className="column-one-third establishment-summary">
        <aside>
          <dl>
            <dt>Licence number</dt>
            <dd>{ licenceNumber }</dd>

            <dt>Licence holder</dt>
            <dd><a href={`/profile/${elhId}`}>{ elhName }</a></dd>
          </dl>
        </aside>
      </div>
    </div>
  </App>
);

module.exports = connect(Index);
