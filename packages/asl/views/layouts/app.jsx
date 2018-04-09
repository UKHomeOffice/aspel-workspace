const React = require('react');
const { pick } = require('lodash');
const { Provider } = require('react-redux');
const Layout = require('./default');
const Pdf = require('./pdf');

const createStore = require('../../src/create-store');

const App = props => {
  const {
    pdf,
    children,
    exposes,
    filterBy,
    textFilter
  } = props;
  const data = pick(props, exposes);
  const store = createStore(data, { filterBy, textFilter });
  return (
    <Provider store={ store }>
      { pdf
        ? <Pdf { ...props }>{ children }</Pdf>
        : (
          <React.Fragment>
            <script dangerouslySetInnerHTML={{__html: `window.INITIAL_STATE=${JSON.stringify(data)}`}} />
            <Layout { ...props }>{ children }</Layout>
          </React.Fragment>
        )
      }
    </Provider>
  );
};

module.exports = App;
