const React = require('react');
const Layout = require('./layouts/default');

const Acronym = require('./components/acronym');
const Filters = require('./components/filters');

class Join extends React.Component {

  render() {
    const sep = this.props.separator || ', ';
    return React.Children.toArray(this.props.children).reduce((list, item, i) => {
      if (i) {
        list.push(sep);
      }
      return list.concat(item);
    }, []);
  }

}

class Places extends React.Component {
  render() {

    const filterConfig = [
      {
        key: 'site',
        label: 'Location'
      },
      {
        key: 'holding',
        label: 'Holding code'
      },
      {
        key: 'suitability',
        label: 'Suitability code'
      }
    ];

    return (
      <Layout {...this.props} crumbs={['Licensed premises']}>
        {
          this.props.establishment ? (
            <div>
              <h2>{this.props.establishment.name}</h2>
              <h1>Licensed premises</h1>
              <Filters data={this.props.places} filters={filterConfig} />
              <table>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Area</th>
                    <th>Holding Code</th>
                    <th>Suitability</th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.props.places && this.props.places.map(place => (
                    <tr key={place.id}>
                      <td>{ place.site }</td>
                      <td>{ place.name }</td>
                      <td><Join>{ place.holding.map(a =><Acronym>{a}</Acronym>) }</Join></td>
                      <td><Join>{ place.suitability.map(a => <Acronym>{a}</Acronym>) }</Join></td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
          ) : <p>No associated establishment</p>
        }
      </Layout>
    );
  }
}

module.exports = Places;