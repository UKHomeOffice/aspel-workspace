const React = require('react');
const Layout = require('./layouts/default');

const Acronym = require('./components/acronym');

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
    return (
      <Layout {...this.props}>
        {
          this.props.establishment ? (
            <div>
              <h1><a href="/">{this.props.establishment.name}</a></h1>
              <h2>Places</h2>
              <table>
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Name</th>
                    <th>Holding Code</th>
                    <th>Suitability</th>
                    <th><Acronym>NACWO</Acronym></th>
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
                      <td>
                        { place.nacwo && <a href={`/profile/${place.nacwo.profile.id}`}>{place.nacwo.profile.name}</a> }
                        { !place.nacwo && '-' }
                      </td>
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